// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import axios from 'axios';

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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Record saved', record);
        resolve({ data: record });
      }, 500);
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

  uploadFile(file, onUploadProgress, cancel) {
    const formData = new FormData();
    formData.append('file', file);

    const BUCKET_ID = '8e4c2e2d-769e-4bc4-8c1b-1ae9fdc3f07f';
    const UPLOAD_URL = `/api/files/${BUCKET_ID}`;

    return axios.put(`${UPLOAD_URL}/${file.name}`, file, {
      headers: {
        'content-type': 'application/octet-stream',
      },
      onUploadProgress,
      cancelToken: new CancelToken(cancel),
    });
  }

  deleteFile(deleteUrl) {
    return axios.delete(deleteUrl);
  }
}
