// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

export const uploadDraftFiles = (draft, files) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    controller.uploadDraftFiles(draft, files, {
      store: { dispatch, getState, config },
    });
  };
};

export const deleteDraftFile = (file) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    controller.deleteDraftFile(file, {
      store: { dispatch, getState, config },
    });
  };
};

export const setDefaultPreview = (filename) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    const defaultPreviewUrl = getState().files.links.self;
    controller.setDefaultPreviewFile(defaultPreviewUrl, filename, {
      store: { dispatch, getState, config },
    });
  };
};

export const setFilesEnabled = (draft, filesEnabled) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    controller.setFilesEnabled(draft, filesEnabled, {
      store: { dispatch, getState, config },
    });
  };
};
