// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import { useFormikContext } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Grid, Icon, Message, Modal } from 'semantic-ui-react';
import { UploadState } from '../../state/reducers/files';
import { NewVersionButton } from '../NewVersionButton';
import { FileUploaderArea } from './FileUploaderArea';
import { FileUploaderToolbar } from './FileUploaderToolbar';
import { humanReadableBytes } from './utils';
import { i18next } from '@translations/i18next';

// NOTE: This component has to be a function component to allow
//       the `useFormikContext` hook.
export const FileUploaderComponent = ({
  config,
  files,
  isDraftRecord,
  hasParentRecord,
  quota,
  permissions,
  record,
  uploadFilesToDraft,
  importRecordFilesToDraft,
  importButtonIcon,
  importButtonText,
  isFileImportInProgress,
  ...uiProps
}) => {
  // We extract the working copy of the draft stored as `values` in formik
  const { values: formikDraft } = useFormikContext();
  const filesEnabled = _get(formikDraft, 'files.enabled', false);
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
                  {i18next.t('Uploading the selected files would result in')}{' '}
                  {humanReadableBytes(filesSize + acceptedFilesSize)}
                  {i18next.t('but the limit is')}
                  {humanReadableBytes(quota.maxStorage)}.
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

  const displayImportBtn =
    filesEnabled && isDraftRecord && hasParentRecord && !filesList.length;

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
            />
          )}
        </Grid.Row>
        {displayImportBtn && (
          <Grid.Row className="file-import-note-row">
            <Grid.Column width={16}>
              <Message visible info>
                <div style={{ display: 'inline-block', float: 'right' }}>
                  <Button
                    type="button"
                    size="mini"
                    primary={true}
                    icon={importButtonIcon}
                    content={importButtonText}
                    onClick={() => importRecordFilesToDraft()}
                    disabled={isFileImportInProgress}
                    loading={isFileImportInProgress}
                  />
                </div>
                <p style={{ marginTop: '5px', display: 'inline-block' }}>
                  <Icon name="info circle" />
                  {i18next.t('You can import files from the previous version.')}
                </p>
              </Message>
            </Grid.Column>
          </Grid.Row>
        )}
        {filesEnabled && (
          <Grid.Row className="file-upload-area-row">
            <FileUploaderArea
              {...uiProps}
              filesList={filesList}
              dropzoneParams={dropzoneParams}
              isDraftRecord={isDraftRecord}
              filesEnabled={filesEnabled}
            />
          </Grid.Row>
        )}
        {isDraftRecord ? (
          <Grid.Row className="file-upload-note-row">
            <Grid.Column width={16}>
              <Message visible warning>
                <p>
                  <Icon name="warning sign" />
                  {i18next.t(
                    'File addition, removal or modification are not allowed after you have published your upload.'
                  )}
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
                  {i18next.t(
                    'You must create a new version to add, modify or delete files.'
                  )}
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
  dragText: PropTypes.string,
  files: fileDetailsShape,
  isDraftRecord: PropTypes.bool,
  hasParentRecord: PropTypes.bool,
  quota: PropTypes.shape({
    maxStorage: PropTypes.number,
    maxFiles: PropTypes.number,
  }),
  record: PropTypes.object,
  uploadButtonIcon: PropTypes.string,
  uploadButtonText: PropTypes.string,
  importButtonIcon: PropTypes.string,
  importButtonText: PropTypes.string,
  isFileImportInProgress: PropTypes.bool,
  importRecordFilesToDraft: PropTypes.func,
  uploadFilesToDraft: PropTypes.func,
};

FileUploaderComponent.defaultProps = {
  dragText: i18next.t('Drag and drop file(s)'),
  isDraftRecord: true,
  hasParentRecord: false,
  quota: {
    maxFiles: 5,
    maxStorage: 10 ** 10,
  },
  uploadButtonIcon: 'upload',
  uploadButtonText: i18next.t('Upload files'),
  importButtonIcon: 'sync',
  importButtonText: i18next.t('Import files'),
};
