// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import axios from 'axios';

const CancelToken = axios.CancelToken;
const apiConfig = {
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
};
const axiosWithConfig = axios.create(apiConfig);

/**
 * API client response.
 */
export class DepositApiClientResponse {
  constructor(data, errors) {
    this.data = data;
    this.errors = errors;
  }
}

export class DepositApiClient {
  constructor(createDraftURL, recordSerializer) {
    if (this.constructor === DepositApiClient) {
      throw new Error('Abstract');
    }
  }

  async createDraft(draft) {
    throw new Error('Not implemented.');
  }

  async saveDraft(draft, draftLinks) {
    throw new Error('Not implemented.');
  }

  async publishDraft(draftLinks) {
    throw new Error('Not implemented.');
  }

  async deleteDraft(draftLinks) {
    throw new Error('Not implemented.');
  }

  async reservePID(draftLinks, pidType) {
    throw new Error('Not implemented.');
  }

  async discardPID(draftLinks, pidType) {
    throw new Error('Not implemented.');
  }
}

/**
 * API Client for deposits.
 */
export class RDMDepositApiClient extends DepositApiClient {
  constructor(createDraftURL, recordSerializer) {
    super();
    this.createDraftURL = createDraftURL;
    this.recordSerializer = recordSerializer;
  }

  async _createResponse(axiosRequest) {
    try {
      const response = await axiosRequest();
      const data = this.recordSerializer.deserialize(response.data || {});
      const errors = this.recordSerializer.deserializeErrors(
        response.data.errors || []
      );
      return new DepositApiClientResponse(data, errors);
    } catch (error) {
      const data = this.recordSerializer.deserialize(error.response.data || {});
      const errors = this.recordSerializer.deserializeErrors(
        error.response.data.errors || []
      );
      const wrapped = new DepositApiClientResponse(data, errors);
      throw new Error(wrapped);
    }
  }

  /**
   * Calls the API to create a new draft.
   *
   * @param {object} draft - Serialized draft
   */
  async createDraft(draft) {
    const payload = this.recordSerializer.serialize(draft);
    return this._createResponse(() =>
      axiosWithConfig.post(this.createDraftURL, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.inveniordm.v1+json',
        },
      })
    );
  }

  /**
   * Calls the API to save a pre-existing draft.
   *
   * @param {object} draft - the draft payload
   */
  async saveDraft(draft, draftLinks) {
    const payload = this.recordSerializer.serialize(draft);
    return this._createResponse(() =>
      axiosWithConfig.put(draftLinks.self, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.inveniordm.v1+json',
        },
      })
    );
  }

  /**
   * Publishes the draft by calling its publish link.
   *
   * @param {string} draftLinks - the URL to publish the draft
   */
  async publishDraft(draftLinks) {
    return this._createResponse(() =>
      axiosWithConfig.post(
        draftLinks.publish,
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
   * @param {string} draftLinks - the URL to delete the draft
   */
  async deleteDraft(draftLinks) {
    return this._createResponse(() =>
      axiosWithConfig.delete(
        draftLinks.self,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
  }

  /**
   * Calls the API to reserve a PID.
   *
   */
  async reservePID(draftLinks, pidType) {
    return this._createResponse(() => {
      const linkName = `reserve_${pidType}`;
      const link = draftLinks[linkName];
      return axiosWithConfig.post(
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
  async discardPID(draftLinks, pidType) {
    return this._createResponse(() => {
      const linkName = `reserve_${pidType}`;
      const link = draftLinks[linkName];
      return axiosWithConfig.delete(
        link,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    });
  }
}

/**
 * Abstract class for File API Client.
 * @constructor
 * @abstract
 */
export class DepositFileApiClient {
  constructor() {
    if (this.constructor === DepositFileApiClient) {
      throw new Error('Abstract');
    }
  }
  isCancelled(error) {
    return axios.isCancel(error);
  }

  initializeFileUpload(initializeUploadUrl, filename) {
    throw new Error('Not implemented.');
  }

  uploadFile(uploadUrl, file, onUploadProgress, cancel) {
    throw new Error('Not implemented.');
  }

  finalizeFileUpload(finalizeUploadUrl) {
    throw new Error('Not implemented.');
  }

  deleteFile(fileLinks) {
    throw new Error('Not implemented.');
  }
}

/**
 * Default File API Client for deposits.
 */
export class RDMDepositFileApiClient extends DepositFileApiClient {
  initializeFileUpload(initializeUploadUrl, filename) {
    const payload = [
      {
        key: filename,
      },
    ];
    return axiosWithConfig.post(initializeUploadUrl, payload, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  uploadFile(uploadUrl, file, onUploadProgressFn, cancelFn) {
    return axiosWithConfig.put(uploadUrl, file, {
      headers: {
        'content-type': 'application/octet-stream',
      },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        onUploadProgressFn && onUploadProgressFn(percent);
      },
      cancelToken: new CancelToken(cancelFn),
    });
  }

  finalizeFileUpload(finalizeUploadUrl) {
    return axiosWithConfig.post(
      finalizeUploadUrl,
      {},
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  importParentRecordFiles(draftLinks) {
    const link = `${draftLinks.self}/actions/files-import`;
    return axiosWithConfig.post(
      link,
      {},
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  deleteFile(fileLinks) {
    return axiosWithConfig.delete(fileLinks.self);
  }
}
