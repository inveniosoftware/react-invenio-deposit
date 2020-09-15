import React from 'react';
import { connect } from 'react-redux';
import FileUploaderComponent from './FileUploader';
import { uploadDraftFiles, deleteDraftFile } from '../../state/actions/files';

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
});

export const FileUploader = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileUploaderComponent);
