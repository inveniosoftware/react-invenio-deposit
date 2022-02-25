// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

export class DepositDraftsService {
  constructor(apiClient) {
    if (this.constructor === DepositDraftsService) {
      throw new Error('Abstract');
    }
  }
  async create(draft) {
    throw new Error('Not implemented.');
  }
  async save(draft) {
    throw new Error('Not implemented.');
  }
  async publish(draftLinks) {
    throw new Error('Not implemented.');
  }
  async delete(draft) {
    throw new Error('Not implemented.');
  }
  async reservePID(draft, pidType) {
    throw new Error('Not implemented.');
  }
  async discardPID(draft, pidType) {
    throw new Error('Not implemented.');
  }
}

export class RDMDepositDraftsService extends DepositDraftsService {
  constructor(apiClient) {
    super();
    this.apiClient = apiClient;
  }

  _draftAlreadyCreated(record) {
    return record.id ? true : false;
  }

  /**
   * Creates the current draft (backend) and changes URL to match its edit URL.
   */
  async create(draft) {
    return this.apiClient.createDraft(draft);
  }

  /**
   * Saves the current draft (backend) and changes URL to match its edit URL.
   */
  async save(draft) {
    return this._draftAlreadyCreated(draft)
      ? this.apiClient.saveDraft(draft, draft.links)
      : this.create(draft);
  }

  /**
   * Publishes the current draft (backend) and redirects to its view URL.
   */
  async publish(draftLinks) {
    return this.apiClient.publishDraft(draftLinks);
  }

  /**
   * Deletes the current draft and redirects to uploads page.
   */
  async delete(draftLinks) {
    return this.apiClient.deleteDraft(draftLinks);
  }

  /**
   * Reserve a PID
   */
  async reservePID(draftLinks, pidType) {
    return this.apiClient.reservePID(draftLinks, pidType);
  }

  /**
   * Discard a previously reserved PID
   */
  async discardPID(draftLinks, pidType) {
    return this.apiClient.discardPID(draftLinks, pidType);
  }
}
