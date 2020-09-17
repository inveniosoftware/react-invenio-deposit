// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

// Drives the business logic of the InvenioFormApp.
// Defines what happens when a button is clicked.

import { setFormErrors } from './state/actions';
import { PUBLISH_SUCCESS, SAVE_SUCCESS } from './state/types';

export class DepositController {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  exists(record) {
    return record.id ? true : false;
  }

  validate(record) {
    console.log('Validate record', record);
  }

  async save_draft(record, { formik, store }) {
    // Saves a draft of the record
    const recordSerializer = store.config.recordSerializer;
    let payload = recordSerializer.serialize(record);
    this.validate(record);
    try {
      if (!this.exists(record)) {
        const response = await this.apiClient.create(payload);
        const draftURL = response.data.links.self_html;
        window.history.replaceState(undefined, '', draftURL);
        payload = response.data;
      }
      const response = await this.apiClient.save(payload);
      store.dispatch({
        type: SAVE_SUCCESS,
        payload: response,
      });
      formik.setSubmitting(false);
    } catch (error) {
      store.dispatch(setFormErrorsFromResponse(error, formik));
    }
  }

  async publish_draft(record, { formik, store }) {
    // Publishes a draft to make it a full fledged record
    const recordSerializer = store.config.recordSerializer;
    let payload = recordSerializer.serialize(record);
    this.validate(payload);
    try {
      if (!this.exists(record)) {
        const response = await this.apiClient.create(payload);
        const draftURL = response.data.links.self_html;
        window.history.replaceState(undefined, '', draftURL);
        payload = response.data;
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
      store.dispatch(setFormErrors(error, formik, record));
    }
  }
}
