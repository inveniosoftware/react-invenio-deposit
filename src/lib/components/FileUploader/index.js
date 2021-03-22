// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { connect } from 'react-redux';
import { FileUploaderComponent } from './FileUploader';
import {
  uploadDraftFiles,
  deleteDraftFile,
  setDefaultPreview,
  setFilesEnabled,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const { links, defaultFilePreview, entries, enabled } = state.files;
  return {
    files: entries,
    links,
    defaultFilePreview,
    filesEnabled: enabled,
    record: state.deposit.record,
    config: state.deposit.config,
    permissions: state.deposit.permissions,
  };
};

const mapDispatchToProps = (dispatch) => ({
  uploadFilesToDraft: (draft, files) =>
    dispatch(uploadDraftFiles(draft, files)),
  deleteFileFromRecord: (file) => dispatch(deleteDraftFile(file)),
  setDefaultPreviewFile: (filename) => dispatch(setDefaultPreview(filename)),
  setFilesEnabled: (draft, filesEnabled) =>
    dispatch(setFilesEnabled(draft, filesEnabled)),
});

export const FileUploader = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileUploaderComponent);
