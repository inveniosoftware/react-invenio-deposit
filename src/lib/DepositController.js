// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

// Drives the business logic of the InvenioFormApp.
// Defines what happens when a button is clicked.

import _set from 'lodash/set';
import { setFormErrors } from './state/actions';
import {
  CREATE_DEPOSIT_SUCCESS,
  PUBLISH_SUCCESS,
  SAVE_SUCCESS,
} from './state/types';

export class DepositController {
  constructor(apiClient, fileUploader) {
    this.apiClient = apiClient;
    this.fileUploader = fileUploader;
  }

  draftAlreadyCreated(record) {
    return record.id ? true : false;
  }

  validate(record) {
    console.log('Validate record', record);
  }

  async createDraft(draft_payload, { store }) {
    const recordSerializer = store.config.recordSerializer;
    const response = await this.apiClient.create(draft_payload);
    store.dispatch({
      type: CREATE_DEPOSIT_SUCCESS,
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

    this.validate(payload);
    let response = {};
    try {
      if (!this.draftAlreadyCreated(payload)) {
        response = await this.createDraft(payload, { store });
      } else {
        response = await this.apiClient.save(payload);
      }
      store.dispatch({
        type: SAVE_SUCCESS,
        payload: { data: recordSerializer.deserialize(response.data) },
      });
      formik.setSubmitting(false);
    } catch (error) {
      store.dispatch(setFormErrors(error, formik, draft));
    }
  }

  async publishDraft(draft, { formik, store }) {
    // Publishes a draft to make it a full fledged record
    const recordSerializer = store.config.recordSerializer;
    let payload = recordSerializer.serialize(draft);
    this.validate(payload);
    let response = {};
    try {
      if (!this.draftAlreadyCreated(payload)) {
        response = await this.createDraft(payload, { store });
      } else {
        response = await this.apiClient.publish(payload);
      }
      store.dispatch({
        type: PUBLISH_SUCCESS,
        payload: { data: recordSerializer.deserialize(response.data) },
      });
      formik.setSubmitting(false);
      const recordURL = response.data.links.self_html;
      window.location.replace(recordURL);
    } catch (error) {
      store.dispatch(setFormErrors(error, formik, draft));
    }
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
      response = await this.createDraft({}, { store });
      payload = response.data;
    }

    for (const file of files) {
      // TODO: remove the default value for `links.draft_files` when REST integration completes
      const uploadFileUrl = payload.links.files;
      this.fileUploader.upload(uploadFileUrl, file, {
        store,
      });
    }
  };

  async deleteDraftFile(file, { store }) {
    try {
      const deleteFileUrl = file.links.self;
      this.fileUploader.deleteUpload(deleteFileUrl, file, { store });
    } catch (e) {
      store.dispatch({ type: 'FILE_DELETE_FAILED' });
    }
  }
}
