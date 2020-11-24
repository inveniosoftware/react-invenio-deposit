// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './state/reducers';
import { UploadState } from './state/reducers/files';
import { INITIAL_STORE_STATE } from './storeConfig';

const preloadFiles = (files) =>
  files
    .map((file) => {
      let hasSize;
      if (file.size) {
        hasSize = true;
      }
      // TODO: fix this as the lack of size is not always an error e.g upload ongoing in another tab
      return hasSize
        ? { status: UploadState.finished, progress: 100, ...file }
        : { status: UploadState.error, progress: 100, ...file };
    })
    .reduce((acc, current) => {
      acc[current.filename] = { ...current };
      return acc;
    }, {});

export function configureStore(appConfig) {
  const { record, config, ...apiConfig } = appConfig;
  const initialDepositState = { record, config, ...INITIAL_STORE_STATE };
  const preloadedState = {
    deposit: initialDepositState,
    files: preloadFiles(record.files || []),
  };

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk.withExtraArgument(apiConfig)))
  );
}
