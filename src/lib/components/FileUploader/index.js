import React from 'react';
import { connect } from 'react-redux';
import FileUploaderComponent from './FileUploader';
import {
  uploadDraftFiles,
  deleteDraftFile,
  setDefaultPreviewFile,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const { isFileUploadInProgress, ...files } = state.files;
  return {
    files: files,
    record: state.deposit.record,
    config: state.deposit.config,
  };
};

const mapDispatchToProps = (dispatch) => ({
  uploadFilesToDraft: (record, files) =>
    dispatch(uploadDraftFiles(record, files)),
  deleteFileFromRecord: (file) => dispatch(deleteDraftFile(file)),
  setDefaultPreviewFile: (filename) =>
    dispatch(setDefaultPreviewFile(filename)),
});

export const FileUploader = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileUploaderComponent);
