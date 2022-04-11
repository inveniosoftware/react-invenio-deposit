// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021-2022 Graz University of Technology.
// Copyright (C)      2022 TU Wien.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import { useFormikContext } from 'formik';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component, useState } from 'react';
import Dropzone from 'react-dropzone';
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Icon,
  Popup,
  Progress,
  Segment,
  Table,
} from 'semantic-ui-react';
import { humanReadableBytes } from './utils';

const FileTableHeader = ({ isDraftRecord }) => (
  <Table.Header>
    <Table.Row className="file-table-row">
      <Table.HeaderCell className="file-table-header-cell">
        {i18next.t('Preview')}{' '}
        <Popup
          content="Set the default preview"
          trigger={<Icon fitted name="help circle" size="small" />}
        />
      </Table.HeaderCell>
      <Table.HeaderCell className="file-table-header-cell">
        {i18next.t('Filename')}
      </Table.HeaderCell>
      <Table.HeaderCell className="file-table-header-cell">
        {i18next.t('Size')}
      </Table.HeaderCell>
      {isDraftRecord && (
        <Table.HeaderCell textAlign="center" className="file-table-header-cell">
          {i18next.t('Progress')}
        </Table.HeaderCell>
      )}
      {isDraftRecord && <Table.HeaderCell className="file-table-header-cell" />}
    </Table.Row>
  </Table.Header>
);

const FileTableRow = ({
  isDraftRecord,
  file,
  deleteFile,
  defaultPreview,
  setDefaultPreview,
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDefaultPreview = defaultPreview === file.name;

  const handleDelete = async (file) => {
    setIsDeleting(true);
    try {
      await deleteFile(file);
      if (isDefaultPreview) {
        setDefaultPreview('');
      }
    } catch (error) {}
  };

  const handleCancelUpload = (file) => {
    setIsCancelling(true);
    file.cancelUploadFn();
  };

  return (
    <Table.Row key={file.name} className="file-table-row">
      <Table.Cell className="file-table-cell" width={2}>
        {/* TODO: Investigate if react-deposit-forms optimized Checkbox field
                  would be more performant */}
        <Checkbox
          checked={isDefaultPreview}
          onChange={() => setDefaultPreview(isDefaultPreview ? '' : file.name)}
        />
      </Table.Cell>
      <Table.Cell className="file-table-cell" width={10}>
        {file.uploadState.isPending ? (
          file.name
        ) : (
          <a
            href={_get(file, 'links.content', '')}
            target="_blank"
            rel="noopener noreferrer"
          >
            {file.name}
          </a>
        )}
        <br />
        {file.checksum && (
          <div className="ui text-muted">
            <span style={{ fontSize: '10px' }}>{file.checksum}</span>{' '}
            <Popup
              content={i18next.t(
                'This is the file fingerprint (MD5 checksum), which can be used to verify the file integrity.'
              )}
              trigger={<Icon fitted name="help circle" size="small" />}
              position="top center"
            />
          </div>
        )}
      </Table.Cell>
      <Table.Cell className="file-table-cell" width={2}>
        {file.size ? humanReadableBytes(file.size, decimalSizeDisplay) : ''}
      </Table.Cell>
      {isDraftRecord && (
        <Table.Cell className="file-table-cell file-upload-pending" width={2}>
          {!file.uploadState?.isPending && (
            <Progress
              className="file-upload-progress"
              percent={file.progressPercentage}
              error={file.uploadState.isFailed}
              size="medium"
              color="blue"
              progress
              autoSuccess
              active
            />
          )}
          {file.uploadState?.isPending && <span>{i18next.t('Pending')}</span>}
        </Table.Cell>
      )}
      {isDraftRecord && (
        <Table.Cell textAlign="right" width={2} className="file-table-cell">
          {(file.uploadState?.isFinished || file.uploadState?.isFailed) &&
            (isDeleting ? (
              <Icon loading name="spinner" />
            ) : (
              <Icon
                link
                className="action"
                name="trash alternate outline"
                color="blue"
                disabled={isDeleting}
                onClick={() => handleDelete(file)}
              />
            ))}
          {file.uploadState?.isUploading && (
            <Button
              compact
              type="button"
              negative
              size="tiny"
              disabled={isCancelling}
              onClick={() => handleCancelUpload(file)}
            >
              {isCancelling ? (
                <Icon loading name="spinner" />
              ) : (
                i18next.t('Cancel')
              )}
            </Button>
          )}
        </Table.Cell>
      )}
    </Table.Row>
  );
};

const FileUploadBox = ({
  isDraftRecord,
  filesList,
  dragText,
  uploadButtonIcon,
  uploadButtonText,
  openFileDialog,
}) =>
  isDraftRecord && (
    <Segment
      basic
      padded="very"
      className={
        filesList.length ? 'file-upload-area' : 'file-upload-area no-files'
      }
    >
      <Grid columns={3} textAlign="center">
        <Grid.Row verticalAlign="middle">
          <Grid.Column width="7">
            <Header size="small">{dragText}</Header>
          </Grid.Column>
          <Grid.Column width="2">- {i18next.t('or')} -</Grid.Column>
          <Grid.Column width="7">
            <Button
              type="button"
              primary={true}
              labelPosition="left"
              icon={uploadButtonIcon}
              content={uploadButtonText}
              onClick={() => openFileDialog()}
              disabled={openFileDialog === null}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );

const FilesListTable = ({
  isDraftRecord,
  filesList,
  deleteFile,
  decimalSizeDisplay,
}) => {
  const { setFieldValue, values: formikDraft } = useFormikContext();
  const defaultPreview = _get(formikDraft, 'files.default_preview', '');
  return (
    <Table>
      <FileTableHeader isDraftRecord={isDraftRecord} />
      <Table.Body>
        {filesList.map((file) => {
          return (
            <FileTableRow
              key={file.name}
              isDraftRecord={isDraftRecord}
              file={file}
              deleteFile={deleteFile}
              defaultPreview={defaultPreview}
              setDefaultPreview={(filename) =>
                setFieldValue('files.default_preview', filename)
              }
              decimalSizeDisplay={decimalSizeDisplay}
            />
          );
        })}
      </Table.Body>
    </Table>
  );
};

export class FileUploaderArea extends Component {
  render() {
    const { filesEnabled, dropzoneParams, filesList } = this.props;
    return filesEnabled ? (
      <Dropzone {...dropzoneParams}>
        {({ getRootProps, getInputProps, open: openFileDialog }) => (
          <Grid.Column width={16}>
            <span {...getRootProps()}>
              <input {...getInputProps()} />
              {filesList.length !== 0 && (
                <Grid.Column verticalAlign="middle">
                  <FilesListTable {...this.props} />
                </Grid.Column>
              )}
              <FileUploadBox {...this.props} openFileDialog={openFileDialog} />
            </span>
          </Grid.Column>
        )}
      </Dropzone>
    ) : (
      <Grid.Column width={16}>
        <Segment basic padded="very" className="file-upload-area no-files">
          <Grid textAlign="center">
            <Grid.Row verticalAlign="middle">
              <Grid.Column>
                <Header size="medium">
                  {i18next.t('This is a Metadata only record')}
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Grid.Column>
    );
  }
}

FileUploaderArea.propTypes = {
  deleteFile: PropTypes.func,
  dragText: PropTypes.string,
  dropzoneParams: PropTypes.object,
  filesEnabled: PropTypes.bool,
  filesList: PropTypes.array,
  isDraftRecord: PropTypes.bool,
  links: PropTypes.object,
  setDefaultPreviewFile: PropTypes.func,
  uploadButtonIcon: PropTypes.string,
  uploadButtonText: PropTypes.string,
  decimalSizeDisplay: PropTypes.bool,
};
