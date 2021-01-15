// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

// Drives the business logic of the InvenioFormApp.
// Defines what happens when a button is clicked.

import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';
import {
  ACTION_CREATE_SUCCEEDED,
  ACTION_PUBLISH_FAILED,
  ACTION_PUBLISH_SUCCEEDED,
  ACTION_SAVE_PARTIALLY_SUCCEEDED,
  ACTION_SAVE_SUCCEEDED,
  ACTION_SAVE_FAILED,
} from './state/types';


export class DepositController {
  constructor(apiClient, fileUploader) {
    this.apiClient = apiClient;
    this.fileUploader = fileUploader;
  }

  draftAlreadyCreated(record) {
    return record.id ? true : false;
  }

  async createDraft(draft_payload, { store }) {
    const recordSerializer = store.config.recordSerializer;
    const response = await this.apiClient.create(draft_payload);

    // TODO: Deal with case when create fails using formik.setErrors(errors);
    store.dispatch({
      type: ACTION_CREATE_SUCCEEDED,
      payload: { data: recordSerializer.deserialize(response.data) },
    });

    const draftURL = response.data.links.self_html;
    window.history.replaceState(undefined, '', draftURL);
    return response;
  }

  async saveDraft(draft, { formik, store }) {
    // Saves a draft of the record
    const recordSerializer = store.config.recordSerializer;

    // Set defaultPreview for files
    draft = _set(
      draft,
      'defaultFilePreview',
      store.getState().deposit.defaultFilePreview
    );

    let payload = recordSerializer.serialize(draft);
    let response = {};
    if (!this.draftAlreadyCreated(payload)) {
      response = await this.createDraft(payload, { store });
    } else {
      response = await this.apiClient.save(payload);
    }

    let data = recordSerializer.deserialize(response.data || {});
    let errors = recordSerializer.deserializeErrors(response.errors || []);

    // response 100% successful
    if ( 200 <= response.code && response.code < 300 && _isEmpty(errors) ) {
      store.dispatch({
        type: ACTION_SAVE_SUCCEEDED,
        payload: { data },
      });
    }
    // response partially successful
    else if (200 <= response.code && response.code < 300 ) {
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

  async publishDraft(draft, { formik, store }) {
    // Publishes a draft to make it a full fledged record
    const recordSerializer = store.config.recordSerializer;
    let payload = recordSerializer.serialize(draft);
    let response = {};

    if (!this.draftAlreadyCreated(payload)) {
      response = await this.createDraft(payload, { store });
    }

    response = await this.apiClient.publish(payload);
    let data = recordSerializer.deserialize(response.data || {});
    let errors = recordSerializer.deserializeErrors(response.errors || []);

    // response 100% successful
    if ( 200 <= response.code && response.code < 300 && _isEmpty(errors) ) {
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
    const uploadsURL = '/uploads';

    if (draft.id) {
      const response = await this.apiClient.delete(draft);
      // TODO: If error, set banner - goes with larger task about
      //       banner feedback
      // For expediency assume all good
    }
    window.location.replace(uploadsURL);
  }

  uploadDraftFiles = async (record, files, { store }) => {
    const recordSerializer = store.config.recordSerializer;
    let payload = recordSerializer.serialize(record);
    let response = {};
    if (!this.draftAlreadyCreated(payload)) {
      // TODO: pass payload instead of `{}`. Currently some fields
      // are prefilled by default, thus the draft creation fails
      // because of schema validation. In principle if no metadata
      // were filled, the payload should be `{}`
      // TODO: Deal with case when create fails
      response = await this.createDraft({}, { store });
      payload = response.data;
    }

    for (const file of files) {
      // TODO: remove the default value for `links.draft_files` when REST integration completes
      const uploadFileUrl = payload.links.files;
      this.fileUploader.upload(uploadFileUrl, file, {store});
    }
  };

  deleteDraftFile(file, { store }) {
    const deleteFileUrl = file.links.self;
    this.fileUploader.deleteUpload(deleteFileUrl, file, { store });
  }

  setDefaultPreviewFile(defaultPreviewUrl, filename, { store }) {
    this.fileUploader.setDefaultPreview(defaultPreviewUrl, filename, {
      store,
    });
  }

  async setFilesEnabled(draftRecord, filesEnabled, { store }) {
    let enableFileUrl;
    if (!this.draftAlreadyCreated(draftRecord)) {
    // TODO: Deal with case when create fails
      const resp = await this.createDraft({}, { store });
      enableFileUrl = resp.data.links.files;
    } else {
      enableFileUrl = draftRecord.links.files;
    }
    this.fileUploader.setFilesEnabled(enableFileUrl, filesEnabled, {
      store,
    });
  }
}
