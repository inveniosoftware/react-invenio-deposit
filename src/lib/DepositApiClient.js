// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import axios from 'axios';
import { reject } from 'lodash';

const CancelToken = axios.CancelToken;

export class DepositApiClient {
  constructor(createUrl) {
    this.createUrl = createUrl;
  }

  create(record) {
    // Calls the API to create a new draft
    return axios.post(this.createUrl, record, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  save(record) {
    // Calls the API to save a pre-existing record.
    // If the record does not exist, an error is returned.
    // TODO: Integrate with backend API
    return axios.put(record.links.self, record, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Publishes the record by calling its publish link.
   *
   * @param {object} record - the payload from create()
   */
  publish(record) {
    // For now publish returns an error when titles array is empty
    // This has the shape of what our current API returns when there are errors
    // in the API call
    return axios.post(
      record.links.publish,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  initializeFileUpload(initializeUploadUrl, filename) {
    const payload = [
      {
        key: filename,
      },
    ];
    return axios.post(initializeUploadUrl, payload, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  uploadFile(uploadUrl, file, onUploadProgress, cancel) {
    const formData = new FormData();
    formData.append('file', file);

    return axios.put(uploadUrl, file, {
      headers: {
        'content-type': 'application/octet-stream',
      },
      onUploadProgress,
      cancelToken: new CancelToken(cancel),
    });
  }

  finalizeFileUpload(finalizeUploadUrl) {
    return axios.post(
      finalizeUploadUrl,
      {},
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  deleteFile(deleteUrl) {
    return axios.delete(deleteUrl);
  }

  setFileMetadata(setFileMetadataUrl, data) {
    return axios.put(setFileMetadataUrl, data, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
