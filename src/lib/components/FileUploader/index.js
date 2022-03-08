// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { connect } from 'react-redux';
import {
  deleteFile,
  importParentFiles,
  uploadFiles,
} from '../../state/actions';
import { FileUploaderComponent } from './FileUploader';

const mapStateToProps = (state) => {
  const { links, entries } = state.files;
  return {
    files: entries,
    links,
    record: state.deposit.record,
    config: state.deposit.config,
    permissions: state.deposit.permissions,
    isFileImportInProgress: state.files.isFileImportInProgress,
    hasParentRecord: Boolean(
      state.deposit.record?.versions?.index &&
        state.deposit.record?.versions?.index > 1
    ),
  };
};

const mapDispatchToProps = (dispatch) => ({
  uploadFiles: (draft, files) => dispatch(uploadFiles(draft, files)),
  importParentFiles: () => dispatch(importParentFiles()),
  deleteFile: (file) => dispatch(deleteFile(file)),
});

export const FileUploader = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileUploaderComponent);
