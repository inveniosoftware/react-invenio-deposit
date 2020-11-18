// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

// Drives the business logic of the InvenioFormApp.
// Defines what happens when a button is clicked.

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
    try {
      if (!this.draftAlreadyCreated(payload)) {
        response = await this.createDraft(payload, { store });
        payload = response.data;
      }
      const response = await this.apiClient.publish(payload);
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
    const payload = recordSerializer.serialize(record);
    if (!this.draftAlreadyCreated(payload)) {
      this.createDraft(payload, { store });
    }
    for (const file of files) {
      // TODO: remove the default value for `links.draft_files` when REST integration completes
      this.fileUploader.upload(
        payload.links.draft_files || `/api/records/${record.id}/draft/files`,
        file,
        {
          store,
        }
      );
    }
  };

  async deleteDraftFile(file, { store }) {
    const fileDeletionUrl = file.links.self;
    try {
      const resp = await this.apiClient.deleteFile(fileDeletionUrl);
      store.dispatch({
        type: 'FILE_DELETED_SUCCESS',
        payload: {
          filename: file.filename,
        },
      });
    } catch (e) {
      console.log('error');
      store.dispatch({ type: 'FILE_DELETE_FAILED' });
    }
  }
}
