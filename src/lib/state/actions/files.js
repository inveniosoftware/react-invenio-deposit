// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

export const uploadDraftFiles = (record, files) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    controller.uploadDraftFiles(record, files, {
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

export const setFilesEnabled = (filesEnabled) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    const draftRecord = getState().deposit.record;
    controller.setFilesEnabled(draftRecord, filesEnabled, {
      store: { dispatch, getState, config },
    });
  };
};
