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

  async createResponse(axios_call) {
    try {
      let response = await axios_call();
      return new DepositApiClientResponse(
        response.data, // exclude errors?
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
   * Calls the API to create a new draft.
   *
   * @param {object} draft - Serialized draft
   */
  async create(draft) {
    return this.createResponse(() =>
      axios.post(this.createUrl, draft, {
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }

  /**
   * Calls the API to save a pre-existing draft.
   *
   * @param {object} draft - Serialized draft
   */
  async save(draft) {
    return this.createResponse(() =>
      axios.put(draft.links.self, draft, {
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }

  /**
   * Publishes the draft by calling its publish link.
   *
   * @param {object} draft - the payload from create()
   */
  async publish(draft) {
    return this.createResponse(() =>
      axios.post(
        draft.links.publish,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
  }

  /**
   * Deletes the draft by calling DELETE on its self link.
   *
   * @param {object} draft - the payload from create()/save()
   */
  async delete(draft) {
    return this.createResponse(() =>
      axios.delete(
        draft.links.self,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
  }

  // TODO: Might consider extracting these out to a FilesApiClient.js

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

  importParentRecordFiles(importFilesUrl) {
    return axios.post(
      importFilesUrl,
      {},
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  /**
   * Calls the API to reserve a PID.
   *
   */
  async reservePID(links, pidType) {
    return this.createResponse(() => {
      const link = `${links.self}/pids/${pidType}`;
      // PIDS-FIXME: should be uncommented when links for pids are released in backend
      // const link = _get(links, `self_${pidType}`, '');
      // if (link === '') {
      //   throw Error(`Cannot get the link to discard the PID for ${pidType}`);
      // }

      return axios.post(
        link,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });
  }

  /**
   * Calls the API to discard a previously reserved PID.
   *
   */
  async discardPID(links, pidType) {
    return this.createResponse(() => {
      const link = `${links.self}/pids/${pidType}`;
      // PIDS-FIXME: should be uncommented when links for pids are released in backend
      // const link = _get(links, `self_${pidType}`, '');
      // if (link === '') {
      //   throw Error(`Cannot get the link to discard the PID for ${pidType}`);
      // }

      return axios.delete(
        link,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });
  }
}
