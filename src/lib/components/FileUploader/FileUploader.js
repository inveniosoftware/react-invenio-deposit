// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';

import { FileUploadArea } from './FileUploadArea';
import { FileUploaderToolbar } from './FileUploaderToolbar';
import { UploadState } from '../../state/reducers/files';

export default class FileUploader extends Component {
  constructor() {
    super();
    this.state = { filesEnabled: true };
  }

  onMetadataOnlyClick = (event, data) => {
    if (!data['disabled']) {
      this.setState((previousState) => {
        return {
          ...previousState,
          ...{ filesEnabled: !previousState.filesEnabled },
        };
      });
    }
  };
  render() {
    const { files, record, uploadFilesToDraft, quota } = this.props;
    const dropzoneParams = {
      preventDropOnDocument: true,
      onDropAccepted: (files) => uploadFilesToDraft(record, files),
      multiple: true,
      noClick: true,
      noKeyboard: true,
      maxFiles: quota.maxFiles,
    };
    let filesList = Object.values(files).map((fileState) => {
      return {
        filename: fileState.filename,
        size: fileState.size,
        checksum: fileState.checksum,
        links: fileState.links,
        upload: {
          initial: fileState.state === UploadState.initial,
          failed: fileState.state === UploadState.error,
          ongoing: fileState.state === UploadState.uploading,
          finished: fileState.state === UploadState.finished,
          progress: fileState.progress,
          cancel: fileState.cancel,
        },
      };
    });

    const filesSize = filesList.reduce(
      (totalSize, file) => (totalSize += file.size),
      0
    );

    return (
      <Grid style={{ marginBottom: '20px' }}>
        <Grid.Row>
          <FileUploaderToolbar
            {...this.props}
            onMetadataOnlyClick={this.onMetadataOnlyClick}
            filesSize={filesSize}
            filesList={filesList}
            isDraftRecord={true}
          />
        </Grid.Row>
        <Grid.Row className="file-upload-area-row">
          <FileUploadArea
            {...this.props}
            filesEnabled={this.state.filesEnabled}
            filesList={filesList}
            dropzoneParams={dropzoneParams}
            isDraftRecord={true}
          />
        </Grid.Row>
        <Grid.Row className="file-upload-note-row">
          <Grid.Column width={16}>
            <Segment basic className="file-upload-note">
              Note: File addition, removal or modification are not allowed after
              you have published your upload. This is because a Digital Object
              Identifier (DOI) is registered with DataCite for each upload.
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const fileDetailsShape = PropTypes.objectOf(
  PropTypes.shape({
    filename: PropTypes.string,
    size: PropTypes.number,
    progress: PropTypes.number,
    checksum: PropTypes.string,
    links: PropTypes.object,
    cancel: PropTypes.func,
    state: PropTypes.oneOf(Object.values(UploadState)),
  })
);

FileUploader.propTypes = {
  files: fileDetailsShape,
  dragText: PropTypes.string,
  uploadButtonText: PropTypes.string,
  uploadButtonIcon: PropTypes.string,
  quota: PropTypes.shape({
    maxStorage: PropTypes.number,
    maxFiles: PropTypes.number,
  }),
};

FileUploader.defaultProps = {
  dragText: 'Drag and drop file(s)',
<<<<<<< HEAD
  uploadButtonText: 'Upload files',
=======
  uploadButtonText: 'Choose files',
>>>>>>> f3a8057... files: style file uploader views
  uploadButtonIcon: 'upload',
  quota: {
    maxFiles: 5,
    maxStorage: 10000000000,
  },
};
