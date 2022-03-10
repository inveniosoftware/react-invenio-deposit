// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _cloneDeep from 'lodash/cloneDeep';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './state/reducers';
import { UploadState } from './state/reducers/files';

const preloadFiles = (files) => {
  const _files = _cloneDeep(files);
  return {
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
              progressPercentage: 100,
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

  const initialCommunitiesState = {
    defaultCommunity: community
      ? community?.id
        ? community
        : {
            id: community,
            uuid: community,
            metadata: {
              title: community,
              description: community,
              type: 'Type',
            },
            links: {
              self_html: '/',
            },
          }
      : null,
  };

  // set parent.review if community passed via url when creating a new draft
  // This will create the review along with the draft creation
  if (community) {
    const hasDraftReview = _get(record, 'parent.review.id', null);
    if (!hasDraftReview) {
      _set(record, 'parent.review', {
        type: 'community-submission',
        receiver: {
          community: community?.id ? community.uuid : community,
        },
      });
    }
  }
  const initialDepositState = {
    record,
    config,
    permissions,
  };

  const preloadedState = {
    deposit: initialDepositState,
    files: preloadFiles(files || {}),
    communities: initialCommunitiesState,
  };

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk.withExtraArgument(extra)))
  );
}
