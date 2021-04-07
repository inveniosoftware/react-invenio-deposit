// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Grid, Icon, Message, Modal } from 'semantic-ui-react';
import { UploadState } from '../../state/reducers/files';
import { NewVersionButton } from '../NewVersionButton';
import { FileUploaderArea } from './FileUploaderArea';
import { FileUploaderToolbar } from './FileUploaderToolbar';
import { humanReadableBytes } from './utils';

// NOTE: This component has to be a function component to allow
//       the `useFormikContext` hook.
export const FileUploaderComponent = ({
  config,
  defaultFilePreview,
  files,
  filesEnabled,
  isDraftRecord,
  quota,
  permissions,
  record,
  toggleFilesEnabled,
  uploadFilesToDraft,
  ...uiProps
}) => {
  // We extract the working copy of the draft stored as `values` in formik
  const { values: formikDraft } = useFormikContext();
  const [warningMsg, setWarningMsg] = useState();

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

      if (maxFileNumberReached) {
        setWarningMsg(
          <div className="content">
            <Message
              warning
              icon="warning circle"
              header="Could not upload files."
              content={`Uploading the selected files would result in ${
                filesList.length + acceptedFiles.length
              } files (max.${quota.maxFiles})`}
            />
          </div>
        );
      } else if (maxFileStorageReached) {
        setWarningMsg(
          <div className="content">
            <Message
              warning
              icon="warning circle"
              header="Could not upload file(s)."
              content={
                <>
                  Uploading the selected files would result in{' '}
                  {humanReadableBytes(filesSize + acceptedFilesSize)} but the
                  limit is {humanReadableBytes(quota.maxStorage)}.
                </>
              }
            />
          </div>
        );
      } else {
        uploadFilesToDraft(formikDraft, acceptedFiles);
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
    <>
      <Grid style={{ marginBottom: '20px' }}>
        <Grid.Row>
          {isDraftRecord && (
            <FileUploaderToolbar
              {...uiProps}
              config={config}
              filesEnabled={filesEnabled}
              filesList={filesList}
              filesSize={filesSize}
              isDraftRecord={isDraftRecord}
              quota={quota}
              toggleFilesEnabled={toggleFilesEnabled}
            />
          )}
        </Grid.Row>
        {filesEnabled && (
          <Grid.Row className="file-upload-area-row">
            <FileUploaderArea
              {...uiProps}
              filesEnabled={filesEnabled}
              filesList={filesList}
              dropzoneParams={dropzoneParams}
              isDraftRecord={isDraftRecord}
              defaultFilePreview={defaultFilePreview}
            />
          </Grid.Row>
        )}
        {isDraftRecord ? (
          <Grid.Row className="file-upload-note-row">
            <Grid.Column width={16}>
              <Message visible warning>
                <p>
                  <Icon name="warning sign" />
                  File addition, removal or modification are not allowed after
                  you have published your upload.
                </p>
              </Message>
            </Grid.Column>
          </Grid.Row>
        ) : (
          <Grid.Row className="file-upload-note-row">
            <Grid.Column width={16}>
              <Message info>
                <NewVersionButton
                  record={record}
                  onError={() => {}}
                  className=""
                  disabled={!permissions.can_new_version}
                  style={{ float: 'right' }}
                />
                <p style={{ marginTop: '5px', display: 'inline-block' }}>
                  <Icon name="info circle" size="large" />
                  You must create a new version to add, modify or delete files.
                </p>
              </Message>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
      <Modal
        open={!!warningMsg}
        header="Warning!"
        content={warningMsg}
        onClose={() => setWarningMsg()}
        closeIcon
      />
    </>
  );
};

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

FileUploaderComponent.propTypes = {
  config: PropTypes.object,
  defaultFilePreview: PropTypes.string,
  dragText: PropTypes.string,
  files: fileDetailsShape,
  filesEnabled: PropTypes.bool,
  isDraftRecord: PropTypes.bool,
  quota: PropTypes.shape({
    maxStorage: PropTypes.number,
    maxFiles: PropTypes.number,
  }),
  record: PropTypes.object,
  toggleFilesEnabled: PropTypes.func,
  uploadButtonIcon: PropTypes.string,
  uploadButtonText: PropTypes.string,
  uploadFilesToDraft: PropTypes.func,
};

FileUploaderComponent.defaultProps = {
  dragText: 'Drag and drop file(s)',
  isDraftRecord: true,
  quota: {
    maxFiles: 5,
    maxStorage: 10 ** 10,
  },
  uploadButtonIcon: 'upload',
  uploadButtonText: 'Upload files',
};
