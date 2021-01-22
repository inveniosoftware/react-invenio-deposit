// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import {
  Button,
  Grid,
  Header,
  Segment,
  Icon,
  Progress,
  Table,
  Popup,
  Checkbox,
} from 'semantic-ui-react';
import { humanReadableBytes } from './utils';
import _get from 'lodash/get';

const FileTableHeader = ({ isDraftRecord }) => (
  <Table.Header>
    <Table.Row className="file-table-row">
      <Table.HeaderCell className="file-table-header-cell">
        Preview{' '}
        <Popup
          content="Set the default preview"
          trigger={<Icon fitted name="help circle" size="small" />}
        />
      </Table.HeaderCell>
      <Table.HeaderCell className="file-table-header-cell">
        Filename
      </Table.HeaderCell>
      <Table.HeaderCell className="file-table-header-cell">
        Size
      </Table.HeaderCell>
      {isDraftRecord && (
        <Table.HeaderCell textAlign="center" className="file-table-header-cell">
          Progress
        </Table.HeaderCell>
      )}
      {isDraftRecord && <Table.HeaderCell className="file-table-header-cell" />}
    </Table.Row>
  </Table.Header>
);

const FileTableRow = ({
  isDraftRecord,
  file,
  deleteFileFromRecord,
  defaultPreview,
  onPreviewClick,
}) => (
  <Table.Row key={file.name} className="file-table-row">
    <Table.Cell className="file-table-cell" width={2}>
      <Checkbox
        checked={
          defaultPreview.checked && defaultPreview.filename === file.name
        }
        onClick={() => onPreviewClick(file)}
      />
    </Table.Cell>
    <Table.Cell className="file-table-cell" width={10}>
      {file.upload.pending ? (
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
        <div>
          <span style={{ fontSize: '10px' }}>{file.checksum}</span>{' '}
          <Popup
            content="This is the file fingerprint (MD5 checksum), which can be used to verify the file integrity."
            trigger={<Icon fitted name="help circle" size="small" />}
            position="top center"
          />
        </div>
      )}
    </Table.Cell>
    <Table.Cell className="file-table-cell" width={2}>
      {file.size ? humanReadableBytes(file.size) : ''}
    </Table.Cell>
    {isDraftRecord && (
      <Table.Cell className="file-table-cell file-upload-pending" width={2}>
        {!file.upload?.pending && (
          <Progress
            className="file-upload-progress"
            percent={file.upload.progress}
            error={file.upload.failed}
            size="medium"
            color="blue"
            progress
            autoSuccess
            active={!file.upload.initial}
            disabled={file.upload.initial}
          />
        )}
        {file.upload?.pending && <span>Pending</span>}
      </Table.Cell>
    )}
    {isDraftRecord && (
      <Table.Cell textAlign="right" width={2} className="file-table-cell">
        {file.upload && !(file.upload.ongoing || file.upload.initial) && (
          <Icon
            className="action"
            name="trash alternate outline"
            color="blue"
            onClick={() => deleteFileFromRecord(file)}
          />
        )}
        {file.upload && file.upload.ongoing && (
          <Button
            compact
            type="button"
            negative
            size="tiny"
            onClick={() => file.upload.cancel()}
          >
            Cancel
          </Button>
        )}
      </Table.Cell>
    )}
  </Table.Row>
);

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
          <Grid.Column width="2">- or -</Grid.Column>
          <Grid.Column width="7">
            <Button
              type="button"
              primary={true}
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
  deleteFileFromRecord,
  defaultPreview,
  onPreviewClick,
}) => (
  <Table>
    <FileTableHeader isDraftRecord={isDraftRecord} />
    <Table.Body>
      {filesList.map((file) => {
        return (
          <FileTableRow
            key={file.name}
            isDraftRecord={isDraftRecord}
            file={file}
            deleteFileFromRecord={deleteFileFromRecord}
            defaultPreview={defaultPreview}
            onPreviewClick={onPreviewClick}
          />
        );
      })}
    </Table.Body>
  </Table>
);

export class FileUploaderArea extends Component {
  constructor(props) {
    super();
    this.state = {
      defaultPreview: {
        filename: '',
        checked: false,
      },
    };
    if (props.defaultFilePreview) {
      this.state.defaultPreview = {
        filename: props.defaultFilePreview,
        checked: true,
      };
    }
  }

  onPreviewClick = (file) => {
    this.setState((prevState) => {
      if (
        prevState.defaultPreview.filename === file.name &&
        prevState.defaultPreview.checked
      ) {
        // Set defaultPreview to null when selected file is unchecked
        this.props.setDefaultPreviewFile(null);
        return {
          defaultPreview: {
            filename: file.name,
            checked: false,
          },
        };
      }
      this.props.setDefaultPreviewFile(file.name);
      return {
        defaultPreview: {
          filename: file.name,
          checked: true,
        },
      };
    });
  };

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
                  <FilesListTable
                    {...this.props}
                    onPreviewClick={this.onPreviewClick}
                    defaultPreview={this.state.defaultPreview}
                  />
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
                <Header size="medium">This is a Metadata only record</Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Grid.Column>
    );
  }
}
