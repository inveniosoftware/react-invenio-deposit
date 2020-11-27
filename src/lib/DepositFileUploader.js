// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

// Drives the business logic of the InvenioFormApp.
// Defines what happens when a button is clicked.

import axios from 'axios';
import _indexOf from 'lodash/indexOf';
import {
  FILE_UPLOAD_FAILED,
  FILE_DELETED_SUCCESS,
  FILE_UPLOAD_INITIATE,
  FILE_UPLOAD_START,
  FILE_UPLOAD_CANCELLED,
  FILE_UPLOAD_IN_PROGRESS,
  FILE_UPLOAD_SET_CANCEL_FUNCTION,
  FILE_UPLOAD_FINISHED,
  FILE_DELETE_FAILED,
  SET_DEFAULT_PREVIEW_FILE,
  SET_DEFAULT_PREVIEW_FILE_FAILED,
  SET_FILES_ENABLED,
  SET_FILES_ENABLED_FAILED,
} from './state/types';

export class DepositFileUploader {
  constructor(apiClient, { fileUploadConcurrency } = {}) {
    this.apiClient = apiClient;
    this.currentUploads = [];
    this.pending = [];
    this.maxConcurrentUploads = fileUploadConcurrency || 3;
  }

  _addToCurrentUploads(file) {
    return this.currentUploads.push(file);
  }

  _removeFromCurrentUploads(file) {
    this.currentUploads.splice(_indexOf(this.currentUploads, file), 1);
  }

  _addToPending(file) {
    this.pending.push(file);
  }

  _removeFromPending() {
    return this.pending.shift();
  }

  _flushQueues() {
    this.currentUploads = [];
    this.pending = [];
  }

  _uploadNext = () => {
    let nextUpload;
    if (this.pending.length > 0) {
      nextUpload = this._removeFromPending();
    }

    if (nextUpload) {
      this.upload(nextUpload.initializeUploadUrl, nextUpload.file, {
        store: nextUpload.store,
      });
    } else if (!this.currentUploads.length) {
      this._flushQueues();
    }
  };

  initializeUpload = async (initializeUploadUrl, file, { store }) => {
    try {
      this._addToCurrentUploads(file);
      const resp = await this.apiClient.initializeFileUpload(
        initializeUploadUrl,
        file.name
      );
      const initializedFile = resp.data.entries[0];
      store.dispatch({
        type: FILE_UPLOAD_INITIATE,
        payload: {
          filename: initializedFile.key,
        },
      });
      return initializedFile;
    } catch (e) {
      console.error(e);
    }
  };

  startUpload = async (uploadUrl, file, { store }) => {
    store.dispatch({
      type: FILE_UPLOAD_START,
      payload: { filename: file.name },
    });
    try {
      const resp = await this.apiClient.uploadFile(
        uploadUrl,
        file,
        (e) => {
          store.dispatch({
            type: FILE_UPLOAD_IN_PROGRESS,
            payload: {
              filename: file.name,
              percent: Math.floor((e.loaded / e.total) * 100),
            },
          });
        },
        (c) => {
          // A cancel function for aborting the upload request
          store.dispatch({
            type: FILE_UPLOAD_SET_CANCEL_FUNCTION,
            payload: { filename: file.name, cancel: c },
          });
        }
      );
    } catch (e) {
      if (axios.isCancel(e)) {
        throw new Error(FILE_UPLOAD_CANCELLED);
      } else {
        throw new Error(FILE_UPLOAD_FAILED);
      }
    }
  };

  finalizeUpload = async (finalizeUploadUrl, file, { store }) => {
    try {
      // Independently on what is the status of the filalize step we start
      // the next upload in the queue
      this._removeFromCurrentUploads(file);
      this._uploadNext();
      const resp = await this.apiClient.finalizeFileUpload(finalizeUploadUrl);
      store.dispatch({
        type: FILE_UPLOAD_FINISHED,
        payload: {
          filename: resp.data.key,
          size: resp.data.size,
          checksum: resp.data.checksum,
          links: resp.data.links,
        },
      });
    } catch (e) {
      throw new Error(FILE_UPLOAD_FAILED);
    }
  };

  upload = async (initializeUploadUrl, file, { store }) => {
    if (this.currentUploads.length < this.maxConcurrentUploads) {
      let initializedFileMetadata = await this.initializeUpload(
        initializeUploadUrl,
        file,
        {
          store,
        }
      );
      const startUploadUrl = initializedFileMetadata.links.content;
      // FIXME: rename to links.complete
      const finalizeFileUrl = initializedFileMetadata.links.commit;
      const deleteFileUrl = initializedFileMetadata.links.self;
      try {
        const resp = await this.startUpload(startUploadUrl, file, {
          store,
        });
        this.finalizeUpload(finalizeFileUrl, file, { store });
      } catch (e) {
        // TODO: should handle `FILE_UPLOAD_FAILED` from intermediate requests
        const isUploadCancelledOrFailed = [
          FILE_UPLOAD_CANCELLED,
          FILE_UPLOAD_FAILED,
        ].some((msg) => e.message === msg);
        if (isUploadCancelledOrFailed) {
          // TODO: Should we delete the file automatically?
          const resp = await this.deleteUpload(deleteFileUrl, file, {
            store,
          });
          store.dispatch({
            type: e.message,
            payload: {
              filename: file.name,
            },
          });
        }
      }
    } else {
      this._addToPending({ initializeUploadUrl, file, store });
    }
  };

  deleteUpload = async (fileDeletionUrl, file, { store }) => {
    try {
      const resp = await this.apiClient.deleteFile(fileDeletionUrl);
      store.dispatch({
        type: FILE_DELETED_SUCCESS,
        payload: {
          filename: file.name,
        },
      });
    } catch (e) {
      store.dispatch({ type: FILE_DELETE_FAILED });
    }
  };

  setDefaultPreview = async (defaultPreviewUrl, defaultPreview, { store }) => {
    try {
      const resp = await this.apiClient.setFileMetadata(defaultPreviewUrl, {
        default_preview: defaultPreview,
      });
      store.dispatch({
        type: SET_DEFAULT_PREVIEW_FILE,
        payload: { filename: defaultPreview },
      });
    } catch (e) {
      store.dispatch({ type: SET_DEFAULT_PREVIEW_FILE_FAILED });
    }
  };

  setFilesEnabled = async (enableFileUrl, filesEnabled, { store }) => {
    try {
      const resp = await this.apiClient.setFileMetadata(enableFileUrl, {
        enabled: filesEnabled,
      });
      store.dispatch({
        type: SET_FILES_ENABLED,
        payload: { filesEnabled: resp.data.enabled, links: resp.data.links },
      });
    } catch (e) {
      store.dispatch({ type: SET_FILES_ENABLED_FAILED });
    }
  };
}
