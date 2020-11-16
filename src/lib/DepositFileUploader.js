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

  addToCurrentUploads(file) {
    return this.currentUploads.push(file);
  }

  removeFromCurrentUploads(file) {
    this.currentUploads.splice(_indexOf(this.currentUploads, file), 1);
  }

  addToPending(file) {
    this.pending.push(file);
  }

  removeFromPending() {
    return this.pending.shift();
  }

  flushQueues() {
    this.currentUploads = [];
    this.pending = [];
  }

  uploadNext = ({ store }) => {
    let nextUpload;
    if (this.pending.length > 0) {
      nextUpload = this.removeFromPending();
    }

    if (nextUpload) {
      this.upload(nextUpload, { store });
    } else if (!this.currentUploads.length) {
      this.flushQueues();
    }
  };

  upload = async (file, { store }) => {
    if (this.currentUploads.length < this.maxConcurrentUploads) {
      this.addToCurrentUploads(file);

      store.dispatch({
        type: 'FILE_UPLOAD_START',
        payload: { filename: file.name, size: file.size },
      });
      try {
        const resp = await this.apiClient.uploadFile(
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
        store.dispatch({
          type: 'FILE_UPLOAD_FINISHED',
          payload: {
            filename: resp.data.key,
            size: resp.data.size,
            checksum: resp.data.checksum,
            links: {
              view: resp.data.links.self,
              version: resp.data.links.version,
            },
          },
        });
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
      } finally {
        this.removeFromCurrentUploads(file);
        this.uploadNext({ store });
      }
    } else {
      this.addToPending(file);
    }
  };
}
