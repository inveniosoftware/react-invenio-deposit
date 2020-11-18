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

  _uploadNext = ({ store }) => {
    let nextUpload;
    if (this.pending.length > 0) {
      nextUpload = this._removeFromPending();
    }

    if (nextUpload) {
      this.upload(nextUpload, { store });
    } else if (!this.currentUploads.length) {
      this._flushQueues();
    }
  };

  initializeUpload = async (initializeUploadUrl, file, { store }) => {
    try {
      this._addToCurrentUploads(file);
      const resp = await this.apiClient.initializeFileUpload(
        initializeUploadUrl,
        file
      );
      const initializedFile = resp.data.entries[0];
      store.dispatch({
        type: 'FILE_UPLOAD_INITIATE',
        payload: { filename: initializedFile.key, size: initializedFile.size },
      });
      return initializedFile;
    } catch (e) {
      console.error(e);
    }
  };

  startUpload = async (uploadUrl, file, { store }) => {
    store.dispatch({
      type: 'FILE_UPLOAD_START',
      payload: { filename: file.name, size: file.size },
    });
    try {
      const resp = await this.apiClient.uploadFile(
        uploadUrl,
        file,
        (e) => {
          store.dispatch({
            type: 'FILE_UPLOAD_IN_PROGRESS',
            payload: {
              filename: file.name,
              percent: Math.floor((e.loaded / e.total) * 100),
            },
          });
        },
        (c) => {
          // A cancel function for aborting the upload request
          store.dispatch({
            type: 'FILE_UPLOAD_SET_CANCEL_FUNCTION',
            payload: { filename: file.name, cancel: c },
          });
        }
      );
    } catch (e) {
      if (axios.isCancel(e)) {
        store.dispatch({
          type: 'FILE_UPLOAD_CANCELLED',
          payload: {
            filename: file.name,
          },
        });
      } else {
        console.log('error');
        store.dispatch({
          type: 'FILE_UPLOAD_FAILED',
          payload: {
            filename: file.name,
          },
        });
      }
    }
  };

  finalizeUpload = async (finalizeUploadUrl, file, { store }) => {
    try {
      const resp = await this.apiClient.finalizeFileUpload(
        finalizeUploadUrl,
        file
      );
      store.dispatch({
        type: 'FILE_UPLOAD_FINISHED',
        payload: {
          filename: resp.data.key,
          size: resp.data.size,
          checksum: resp.data.checksum,
          links: resp.data.links,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      this._removeFromCurrentUploads(file);
      this._uploadNext({ store });
    }
  };

  upload = async (uploadUrl, file, { store }) => {
    if (this.currentUploads.length < this.maxConcurrentUploads) {
      let initializedFileMetadata = await this.initializeUpload(
        uploadUrl,
        file,
        {
          store,
        }
      );
      this.startUpload(initializedFileMetadata.links.upload.href, file, {
        store,
      });
      this.finalizeUpload(initializedFileMetadata.links.self, file, { store });
    } else {
      this._addToPending(file);
    }
  };
}
