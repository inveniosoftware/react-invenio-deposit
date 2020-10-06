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
    return record.id || record.pid ? true : false;
  }

  validate(record) {
    console.log('Validate record', record);
  }

  async createDraft(draft, { store }) {
    const recordSerializer = store.config.recordSerializer;
    const response = await this.apiClient.create(draft);
    store.dispatch({
      type: CREATE_DEPOSIT_SUCCESS,
      payload: { data: recordSerializer.deserialize(response.data) },
    });
    const draftURL = response.data.links.self_html;
    window.history.replaceState(undefined, '', draftURL);
    return response.data;
  }

  async saveDraft(record, { formik, store }) {
    // Saves a draft of the record
    const recordSerializer = store.config.recordSerializer;
    let payload = recordSerializer.serialize(record);
    this.validate(payload);
    try {
      if (!this.draftAlreadyCreated(payload)) {
        payload = this.createDraft(payload, { store });
      }
      const response = await this.apiClient.save(payload);
      store.dispatch({
        type: SAVE_SUCCESS,
        payload: response,
      });
      formik.setSubmitting(false);
    } catch (error) {
      store.dispatch(setFormErrors(error, formik));
    }
  }

  async publishDraft(draft, { formik, store }) {
    // Publishes a draft to make it a full fledged record
    const recordSerializer = store.config.recordSerializer;
    let payload = recordSerializer.serialize(draft);
    this.validate(payload);
    try {
      if (!this.draftAlreadyCreated(payload)) {
        payload = this.createDraft(payload, { store });
      }
      const response = await this.apiClient.publish(payload);
      store.dispatch({
        type: PUBLISH_SUCCESS,
        payload: response,
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
    store.dispatch({
      type: 'FILE_UPLOAD_INITIATE',
      payload: files.map((file) => ({ fileName: file.name, size: file.size })),
    });

    for (const file of files) {
      this.fileUploader.upload(file, { store });
    }
  };

  async deleteDraftFile(file, { formik, store }) {
    //Create draft
    const fileVersionUrl = file.links.version;
    try {
      const resp = await this.apiClient.deleteFile(fileVersionUrl);
      store.dispatch({
        type: 'FILE_DELETED_SUCCESS',
        payload: {
          fileName: file.fileName,
        },
      });
    } catch (e) {
      console.log('error');
      store.dispatch({ type: 'FILE_DELETE_FAILED' });
    }
  }
}
