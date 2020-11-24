import React from 'react';
import { connect } from 'react-redux';
import FileUploaderComponent from './FileUploader';
import {
  uploadDraftFiles,
  deleteDraftFile,
  setCurrentPreviewFile,
} from '../../state/actions';

const mapStateToProps = (state) => {
  const { isFileUploadInProgress, ...files } = state.files;
  return {
    files: files,
    record: state.deposit.record,
  };
};

const mapDispatchToProps = (dispatch) => ({
  uploadFilesToDraft: (record, files) =>
    dispatch(uploadDraftFiles(record, files)),
  deleteFileFromRecord: (file) => dispatch(deleteDraftFile(file)),
  setCurrentPreviewFile: (filename) =>
    dispatch(setCurrentPreviewFile(filename)),
});

export const FileUploader = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileUploaderComponent);
