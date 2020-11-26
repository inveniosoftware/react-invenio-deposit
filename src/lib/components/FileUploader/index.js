import React from 'react';
import { connect } from 'react-redux';
import FileUploaderComponent from './FileUploader';
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  uploadFilesToDraft: (record, files) =>
    dispatch(uploadDraftFiles(record, files)),
  deleteFileFromRecord: (file) => dispatch(deleteDraftFile(file)),
  setDefaultPreviewFile: (filename) => dispatch(setDefaultPreview(filename)),
  setFilesEnabled: (filesEnabled) => dispatch(setFilesEnabled(filesEnabled)),
});

export const FileUploader = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileUploaderComponent);
