// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';

import { FileUploaderArea } from './FileUploaderArea';
import { FileUploaderToolbar } from './FileUploaderToolbar';
import { UploadState } from '../../state/reducers/files';

export default class FileUploader extends Component {
  constructor(props) {
    super();
    this.state = { filesEnabled: props.filesEnabled };
  }

  onMetadataOnlyClick = (event, data) => {
    if (!data['disabled']) {
      this.setState((previousState) => {
        this.props.setFilesEnabled(!previousState.filesEnabled);
        return {
          ...previousState,
          ...{ filesEnabled: !previousState.filesEnabled },
        };
      });
    }
  };

  render() {
    const {
      files,
      record,
      uploadFilesToDraft,
      quota,
      config,
      filesEnabled,
      isDraftRecord,
    } = this.props;
    let filesList = Object.values(files).map((fileState) => {
      return {
        name: fileState.name,
        size: fileState.size,
        checksum: fileState.checksum,
        links: fileState.links,
        upload: {
          initial: fileState.status === UploadState.initial,
          failed: fileState.status === UploadState.error,
          ongoing: fileState.status === UploadState.uploading,
          finished: fileState.status === UploadState.finished,
          pending: fileState.status === UploadState.pending,
          progress: fileState.progress,
          cancel: fileState.cancel,
        },
      };
    });
    const filesSize = filesList.reduce(
      (totalSize, file) => (totalSize += file.size),
      0
    );

    let dropzoneParams = {
      preventDropOnDocument: true,
      onDropAccepted: (acceptedFiles) => {
        const maxFileNumberReached =
          filesList.length + acceptedFiles.length > quota.maxFiles;
        const acceptedFilesSize = acceptedFiles.reduce(
          (totalSize, file) => (totalSize += file.size),
          0
        );
        const maxFileStorageReached =
          filesSize + acceptedFilesSize > quota.maxStorage;
        if (maxFileNumberReached || maxFileStorageReached) {
          // TODO: Give some feedback to user about why the files weren't
          // accepted for upload
          console.log('Maximum number of files reached!');
        } else {
          uploadFilesToDraft(record, acceptedFiles);
        }
      },
      multiple: true,
      noClick: true,
      noKeyboard: true,
      disabled: false,
    };

    const filesLeft = filesList.length < quota.maxFiles;
    if (!filesLeft) {
      dropzoneParams['disabled'] = true;
    }

    return (
      <Grid style={{ marginBottom: '20px' }}>
        <Grid.Row>
          <FileUploaderToolbar
            {...this.props}
            onMetadataOnlyClick={this.onMetadataOnlyClick}
            filesSize={filesSize}
            filesList={filesList}
            isDraftRecord={isDraftRecord}
            config={config}
            filesEnabled={filesEnabled}
          />
        </Grid.Row>
        <Grid.Row className="file-upload-area-row">
          <FileUploaderArea
            {...this.props}
            filesEnabled={this.state.filesEnabled}
            filesList={filesList}
            dropzoneParams={dropzoneParams}
            isDraftRecord={isDraftRecord}
            defaultFilePreview={this.props.defaultFilePreview}
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
    name: PropTypes.string,
    size: PropTypes.number,
    progress: PropTypes.number,
    checksum: PropTypes.string,
    links: PropTypes.object,
    cancel: PropTypes.func,
    state: PropTypes.oneOf(Object.values(UploadState)),
    enabled: PropTypes.bool,
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
  config: PropTypes.object,
};

FileUploader.defaultProps = {
  dragText: 'Drag and drop file(s)',
  uploadButtonText: 'Upload files',
  uploadButtonIcon: 'upload',
  quota: {
    maxFiles: 5,
    maxStorage: 10000000000,
  },
  isDraftRecord: true,
};
