// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { TOGGLE_FILES_ENABLED } from '../types';

export const uploadDraftFiles = (draft, files) => {
  return (dispatch, getState, config) => {
    const controller = config.controller;
    return controller.uploadDraftFiles(draft, files, {
      store: { dispatch, getState, config },
    });
  };
};

export const deleteDraftFile = (file) => {
  return (dispatch, getState, config) => {
    const controller = config.controller;
    return controller.deleteDraftFile(file, {
      store: { dispatch, getState, config },
    });
  };
};

export const setDefaultPreview = (filename) => {
  return (dispatch, getState, config) => {
    const controller = config.controller;
    const defaultPreviewUrl = getState().files.links.self;
    return controller.setDefaultPreviewFile(defaultPreviewUrl, filename, {
      store: { dispatch, getState, config },
    });
  };
};

export const toggleFilesEnabled = (filesEnabled) => {
  return (dispatch) => {
    return dispatch({
      type: TOGGLE_FILES_ENABLED,
      payload: {
        filesEnabled: filesEnabled,
      },
    });
  };
};
