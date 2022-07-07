// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import axios from "axios";

const CancelToken = axios.CancelToken;
const BASE_HEADERS = {
  "json": { "Content-Type": "application/json" },
  "vnd+json": {
    "Content-Type": "application/json",
    "Accept": "application/vnd.inveniordm.v1+json",
  },
  "octet-stream": { "Content-Type": "application/octet-stream" },
};
const apiConfig = {
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  headers: BASE_HEADERS.json,
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
  /* eslint-disable no-unused-vars */
  constructor(createDraftURL, recordSerializer) {
    if (this.constructor === DepositApiClient) {
      throw new Error("Abstract");
    }
  }

  async createDraft(draft) {
    throw new Error("Not implemented.");
  }

  async saveDraft(draft, draftLinks) {
    throw new Error("Not implemented.");
  }

  async publishDraft(draftLinks) {
    throw new Error("Not implemented.");
  }

  async deleteDraft(draftLinks) {
    throw new Error("Not implemented.");
  }

  async reservePID(draftLinks, pidType) {
    throw new Error("Not implemented.");
  }

  async discardPID(draftLinks, pidType) {
    throw new Error("Not implemented.");
  }

  async createOrUpdateReview(draftLinks, communityId) {
    throw new Error("Not implemented.");
  }

  async deleteReview(draftLinks) {
    throw new Error("Not implemented.");
  }

  async submitReview(draftLinks) {
    throw new Error("Not implemented.");
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
      const errorData = error.response.data;
      throw new DepositApiClientResponse({}, errorData);
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
        headers: BASE_HEADERS["vnd+json"],
        params: { expand: 1 },
      })
    );
  }

  /**
   * Calls the API to read a pre-existing draft.
   *
   * @param {object} draftLinks - the draft links object
   */
  async readDraft(draftLinks) {
    return this._createResponse(() =>
      axiosWithConfig.get(draftLinks.self, {
        headers: BASE_HEADERS["vnd+json"],
        params: { expand: 1 },
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
        headers: BASE_HEADERS["vnd+json"],
        params: { expand: 1 },
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
      axiosWithConfig.post(draftLinks.publish, {}, { params: { expand: 1 } })
    );
  }

  /**
   * Deletes the draft by calling DELETE on its self link.
   *
   * @param {string} draftLinks - the URL to delete the draft
   */
  async deleteDraft(draftLinks) {
    return this._createResponse(() => axiosWithConfig.delete(draftLinks.self, {}));
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
          params: { expand: 1 },
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
      return axiosWithConfig.delete(link, {
        params: { expand: 1 },
      });
    });
  }

  /**
   * Creates a review request in initial state for draft by calling its
   * review link.
   *
   * @param {object} draftLinks - the draft links object
   */
  async createOrUpdateReview(draftLinks, communityId) {
    return this._createResponse(() =>
      axiosWithConfig.put(draftLinks.review, {
        receiver: {
          community: communityId,
        },
        type: "community-submission",
      })
    );
  }

  /**
   * Deletes a review request associated with the draft using its review link.
   *
   * @param {object} draftLinks - the draft links object
   */
  async deleteReview(draftLinks) {
    return this._createResponse(() => axiosWithConfig.delete(draftLinks.review, {}));
  }

  /**
   * Submits the draft for review by calling its submit-review link.
   *
   * @param {object} draftLinks - the draft links object
   */
  async submitReview(draftLinks, reviewComment) {
    return this._createResponse(() => {
      return axiosWithConfig.post(
        draftLinks["submit-review"],
        reviewComment
          ? {
              payload: {
                content: reviewComment,
                format: "html",
              },
            }
          : {}
      );
    });
  }

  /**
   * Cancels the review for the draft by calling its cancel link.
   *
   * @param reviewLinks
   * @param reviewComment
   */
  async cancelReview(reviewLinks, reviewComment) {
    return axiosWithConfig.post(
      reviewLinks.actions.cancel,
      reviewComment
        ? {
            payload: {
              content: reviewComment,
              format: "html",
            },
          }
        : {}
    );
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
      throw new Error("Abstract");
    }
  }

  isCancelled(error) {
    return axios.isCancel(error);
  }

  initializeFileUpload(initializeUploadUrl, filename) {
    throw new Error("Not implemented.");
  }

  uploadFile(uploadUrl, file, onUploadProgress, cancel) {
    throw new Error("Not implemented.");
  }

  finalizeFileUpload(finalizeUploadUrl) {
    throw new Error("Not implemented.");
  }

  deleteFile(fileLinks) {
    throw new Error("Not implemented.");
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
    return axiosWithConfig.post(initializeUploadUrl, payload, {});
  }

  uploadFile(uploadUrl, file, onUploadProgressFn, cancelFn) {
    return axiosWithConfig.put(uploadUrl, file, {
      headers: BASE_HEADERS["octet-stream"],
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        onUploadProgressFn && onUploadProgressFn(percent);
      },
      cancelToken: new CancelToken(cancelFn),
    });
  }

  finalizeFileUpload(finalizeUploadUrl) {
    return axiosWithConfig.post(finalizeUploadUrl, {});
  }

  importParentRecordFiles(draftLinks) {
    const link = `${draftLinks.self}/actions/files-import`;
    return axiosWithConfig.post(link, {});
  }

  deleteFile(fileLinks) {
    return axiosWithConfig.delete(fileLinks.self);
  }
}
