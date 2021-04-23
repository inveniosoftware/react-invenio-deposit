// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

export const uploadDraftFiles = (draft, files) => {
  return (dispatch, getState, config) => {
    const controller = config.controller;
    return controller.uploadDraftFiles(draft, files, {
      store: { dispatch, getState, config },
    });
  };
};

export const importParentRecordFiles = () => {
  return (dispatch, getState, config) => {
    const controller = config.controller;
    const draft = getState().deposit.record;
    return controller.importParentRecordFiles(draft, {
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
