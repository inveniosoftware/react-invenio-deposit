// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { DepositApiClient } from './DepositApiClient';
import { DepositBootstrap } from './DepositBootstrap';
import { DepositController } from './DepositController';
import { DepositFileUploader } from './DepositFileUploader';
import { DepositRecordSerializer } from './DepositRecordSerializer';
import { configureStore } from './store';
import { i18next } from '@translations/i18next';

export class DepositFormApp extends Component {
  constructor(props) {
    super();
    const apiClient = props.apiClient
      ? props.apiClient
      : new DepositApiClient(props.config.createUrl);

    const fileUploader = props.fileUploader
      ? props.fileUploader
      : new DepositFileUploader(apiClient, props.config);

    const controller = props.controller
      ? props.controller
      : new DepositController(apiClient, fileUploader);

    const recordSerializer = props.recordSerializer
      ? props.recordSerializer
      : new DepositRecordSerializer(props.config.default_locale);

    const appConfig = {
      config: props.config,
      record: recordSerializer.deserialize(props.record),
      community: props.community,
      files: props.files,
      controller: controller,
      apiClient: apiClient,
      fileUploader: fileUploader,
      permissions: props.permissions,
      recordSerializer: recordSerializer,
    };

    this.store = configureStore(appConfig);
  }

  render() {
    return (
      <Provider store={this.store}>
        <I18nextProvider i18n={i18next}>
          <DepositBootstrap>{this.props.children}</DepositBootstrap>
        </I18nextProvider>
      </Provider>
    );
  }
}

DepositFormApp.propTypes = {};
