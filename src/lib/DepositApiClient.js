// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import axios from 'axios';


const CancelToken = axios.CancelToken;

/**
 * API client response.
 *
 * It's a wrapper/sieve around Axios to contain Axios coupling here. It maps
 * good and bad responses to a unified interface.
 *
 */
export class DepositApiClientResponse {
  constructor(data, errors, code) {
    this.data = data;
    this.errors = errors;
    this.code = code;
  }
}


/**
 * API Client for deposits.
 *
 * It mostly uses the API links passed to it from responses.
 *
 */
export class DepositApiClient {
  constructor(createUrl) {
    this.createUrl = createUrl;
  }

  /**
   * Calls the API to create a new draft.
   *
   * @param {object} record - Serialized record
   */
  async create(record) {
    try {
      let response = await axios.post(
        this.createUrl,
        record,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return new DepositApiClientResponse(
        response.data,  // exclude errors?
        response.data.errors,
        response.status
      );
    } catch (error) {
      return new DepositApiClientResponse(
        error.response.data,
        error.response.data.errors,
        error.response.status
      );
    }
  }

  /**
   * Calls the API to save a pre-existing record.
   *
   * @param {object} record - Serialized record
   */
  async save(record) {
    try {
      let response = await axios.put(
        record.links.self,
        record,
        {headers: { 'Content-Type': 'application/json' } }
      );
      return new DepositApiClientResponse(
        response.data,  // exclude errors?
        response.data.errors,
        response.status
      );
    } catch (error) {
      // NOTE: We only get here when status >= 400 is returned and,
      //       at time of writing, partially successful saves return 200 (i.e.
      //       they don't end up here).
      return new DepositApiClientResponse(
        error.response.data,
        error.response.data.errors,
        error.response.status
      );
    }
  }

  /**
   * Publishes the record by calling its publish link.
   *
   * @param {object} record - the payload from create()
   */
  async publish(record) {
    try {
      let response = await axios.post(
        record.links.publish,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return new DepositApiClientResponse(
        response.data,  // exclude errors?
        response.data.errors,
        response.status
      );
    } catch (error) {
      // NOTE: We get here when status >= 400 is returned
      return new DepositApiClientResponse(
        error.response.data,
        error.response.data.errors,
        error.response.status
      );
    }
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
