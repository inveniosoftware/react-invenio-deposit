// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import axios from 'axios';

export class DepositApiClient {
  API_CREATE_ENDPOINT = '/api/rdm-records';
  API_SAVE_ENDPOINT = '/';
  API_PUBLISH_ENDPOINT = '/api/rdm-records/{pid_value}/draft/actions/publish';

  create(record) {
    // Calls the API to create a new draft
    return axios.post(this.API_CREATE_ENDPOINT, record, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  save(record) {
    // Calls the API to save a pre-existing record.
    // If the record does not exist, an error is returned.
    // TODO: Integrate with backend API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Record saved', record);
        resolve({ data: record });
      }, 500);
    });
  }

  publish(record) {
    // For now publish returns an error when titles array is empty
    // This has the shape of what our current API returns when there are errors
    // in the API call
    const publishEndpoint = this.API_PUBLISH_ENDPOINT.replace(
      '{pid_value}', record.pid
    );
    return axios.post(publishEndpoint, {}, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
