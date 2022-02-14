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
import _cloneDeep from 'lodash/cloneDeep';
import _get from 'lodash/get';

const preloadFiles = (files) => {
  const _files = _cloneDeep(files);
  return {
    defaultFilePreview: files.default_preview || null,
    links: files.links || {},
    entries: _get(_files, 'entries', [])
      .map((file) => {
        let hasSize = file.size >= 0;
        const fileState = {
          name: file.key,
          size: file.size || 0,
          checksum: file.checksum || '',
          links: file.links || {},
        };
        // TODO: fix this as the lack of size is not always an error e.g upload ongoing in another tab
        return hasSize
          ? {
              status: UploadState.finished,
              progress: 100,
              ...fileState,
            }
          : { status: UploadState.pending, ...fileState };
      })
      .reduce((acc, current) => {
        acc[current.name] = { ...current };
        return acc;
      }, {}),
  };
};

export function configureStore(appConfig) {
  const { record, community, files, config, permissions, ...extra } = appConfig;
  const initialDepositState = {
    record,
    // TODO: move this if community is stored independently in redux
    community,
    config,
    permissions,
    ...INITIAL_STORE_STATE,
  };
  const preloadedState = {
    deposit: initialDepositState,
    files: preloadFiles(files || {}),
  };

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk.withExtraArgument(extra)))
  );
}
