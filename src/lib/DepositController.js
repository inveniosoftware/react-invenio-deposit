// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

// Drives the business logic of the InvenioFormApp.
// Defines what happens when a button is clicked.

import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';
import {
  ACTION_CREATE_SUCCEEDED,
  ACTION_DELETE_FAILED,
  ACTION_PUBLISH_FAILED,
  ACTION_PUBLISH_SUCCEEDED,
  ACTION_SAVE_FAILED,
  ACTION_SAVE_PARTIALLY_SUCCEEDED,
  ACTION_SAVE_SUCCEEDED,
  DISCARD_PID_FAILED,
  DISCARD_PID_SUCCESS,
  RESERVE_PID_FAILED,
  RESERVE_PID_SUCCESS,
} from './state/types';

export class DepositController {
  constructor(apiClient, fileUploader) {
    this.apiClient = apiClient;
    this.fileUploader = fileUploader;
  }

  draftAlreadyCreated(record) {
    return record.id ? true : false;
  }

  /**
   * Creates the current draft (backend) and changes URL to match its edit URL.
   *
   * @param {object} draft - current draft
   * @param {object} store - redux store
   */
  async createDraft(draft, { store }) {
    const recordSerializer = store.config.recordSerializer;
    const payload = recordSerializer.serialize(draft);
    const response = await this.apiClient.create(payload);

    // TODO: Deal with case when create fails using formik.setErrors(errors);
    store.dispatch({
      type: ACTION_CREATE_SUCCEEDED,
      payload: { data: recordSerializer.deserialize(response.data) },
    });

    const draftURL = response.data.links.self_html;
    window.history.replaceState(undefined, '', draftURL);
    return response;
  }

  /**
   * Saves the current draft (backend) and changes URL to match its edit URL.
   *
   * @param {object} draft - current draft
   * @param {object} formik - the Formik object
   * @param {object} store - redux store
   */
  async saveDraft(draft, { formik, store }) {
    const recordSerializer = store.config.recordSerializer;

    // Set defaultPreview for files
    draft = _set(
      draft,
      'defaultFilePreview',
      store.getState().deposit.defaultFilePreview
    );

    let response = {};
    if (!this.draftAlreadyCreated(draft)) {
      response = await this.createDraft(draft, { store });
    } else {
      let payload = recordSerializer.serialize(draft);
      response = await this.apiClient.save(payload);
    }

    let data = recordSerializer.deserialize(response.data || {});
    let errors = recordSerializer.deserializeErrors(response.errors || []);

    // response 100% successful
    if (200 <= response.code && response.code < 300 && _isEmpty(errors)) {
      store.dispatch({
        type: ACTION_SAVE_SUCCEEDED,
        payload: { data },
      });
    }
    // response partially successful
    else if (200 <= response.code && response.code < 300) {
      store.dispatch({
        type: ACTION_SAVE_PARTIALLY_SUCCEEDED,
        payload: { data, errors },
      });
      formik.setErrors(errors);
    }
    // response exceptionally bad
    else {
      store.dispatch({
        type: ACTION_SAVE_FAILED,
        payload: { errors },
      });
      formik.setErrors(errors);
    }

    formik.setSubmitting(false);
  }

  /**
   * Publishes the current draft (backend) and redirects to its view URL.
   *
   * @param {object} draft - current draft
   * @param {object} formik - the Formik object
   * @param {object} store - redux store
   */
  async publishDraft(draft, { formik, store }) {
    const recordSerializer = store.config.recordSerializer;
    let response = {};

    if (!this.draftAlreadyCreated(draft)) {
      response = await this.createDraft(draft, { store });
    }

    let payload = recordSerializer.serialize(draft);
    response = await this.apiClient.publish(payload);
    let data = recordSerializer.deserialize(response.data || {});
    let errors = recordSerializer.deserializeErrors(response.errors || []);

    // response 100% successful
    if (200 <= response.code && response.code < 300 && _isEmpty(errors)) {
      store.dispatch({
        type: ACTION_PUBLISH_SUCCEEDED,
        payload: { data },
      });
      const recordURL = response.data.links.self_html;
      window.location.replace(recordURL);
    }
    // "succeed or not, there is no partial"
    else {
      store.dispatch({
        type: ACTION_PUBLISH_FAILED,
        payload: { data, errors },
      });
      formik.setErrors(errors);
    }

    formik.setSubmitting(false);
  }

  /**
   * Deletes the current draft and redirects to uploads page.
   *
   * The current draft may not have been saved yet. We only delete the draft
   * if it has been saved.
   *
   * @param {object} draft - current draft
   */
  async deleteDraft(draft, { formik, store }) {
    if (draft.id) {
      const response = await this.apiClient.delete(draft);
      if (!(200 <= response.code && response.code < 300)) {
        store.dispatch({
          type: ACTION_DELETE_FAILED,
          payload: {},
        });
        return;
      }
    }

    const uploadsURL = '/me/uploads';
    window.location.replace(uploadsURL);
  }

  /**
   * Uploads the draft's files.
   *
   * The current draft may not have been saved yet. We create it if not.
   *
   * @param {object} draft - current draft
   * @param {object} files - files to upload
   * @param {object} store - redux store
   */
  async uploadDraftFiles(draft, files, { store }) {
    if (!this.draftAlreadyCreated(draft)) {
      // TODO: Deal with case when create fails
      let response = await this.createDraft(draft, { store });
      draft = response.data;
    } else {
      // We have to save draft before we upload files, because files might have
      // been disabled and we need to re-enable them first. We do it
      // "stealthily" (not using saveDraft) so as to provide a nice UX.
      const recordSerializer = store.config.recordSerializer;
      let payload = recordSerializer.serialize(draft);
      await this.apiClient.save(payload);
    }

    for (const file of files) {
      const uploadFileUrl = draft.links.files;
      this.fileUploader.upload(uploadFileUrl, file, { store });
    }
  }

  /**
   * Delete an uploaded file.
   *
   * @param {object} file - file to delete
   * @param {object} store - redux store
   */
  async deleteDraftFile(file, { store }) {
    const deleteFileUrl = file.links.self;
    await this.fileUploader.deleteUpload(deleteFileUrl, file, { store });
  }

  /**
   * Imports parent record files into the draft
   *
   * Should only be used with already saved draft
   *
   * @param {object} draft - current draft
   * @param {object} store - redux store
   */
  async importParentRecordFiles(draft, { store }) {
    if (!draft.id) return;
    const importFilesUrl = draft.links.self + '/actions/files-import';
    await this.fileUploader.importParentRecordFiles(importFilesUrl, { store });
  }

  /**
   * Reserve a PID
   */
  reservePID = async (draft, pidType, { formik, store }) => {
    const recordSerializer = store.config.recordSerializer;

    const response = await this.apiClient.reservePID(draft, pidType);

    let data = recordSerializer.deserialize(response.data || {});
    let errors = recordSerializer.deserializeErrors(response.errors || []);

    if (200 <= response.code && response.code < 300 && _isEmpty(errors)) {
      store.dispatch({
        type: RESERVE_PID_SUCCESS,
        payload: { data },
      });
    } else {
      store.dispatch({
        type: RESERVE_PID_FAILED,
        payload: { data, errors },
      });
      formik.setErrors(errors);
    }
  };

  /**
   * Discard a previously reserved PID
   */
  discardPID = async (draft, pidType, { formik, store }) => {
    const recordSerializer = store.config.recordSerializer;

    const response = await this.apiClient.discardPID(draft, pidType);

    let data = recordSerializer.deserialize(response.data || {});
    let errors = recordSerializer.deserializeErrors(response.errors || []);

    if (200 <= response.code && response.code < 300 && _isEmpty(errors)) {
      store.dispatch({
        type: DISCARD_PID_SUCCESS,
        payload: { data },
      });
    } else {
      store.dispatch({
        type: DISCARD_PID_FAILED,
        payload: { data, errors },
      });
      formik.setErrors(errors);
    }
  };
}
