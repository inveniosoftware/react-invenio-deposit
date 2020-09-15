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
  Divider,
  Grid,
  Header,
  Segment,
  Icon,
  Progress,
  Table,
  Popup,
} from 'semantic-ui-react';
import { UploadState } from '../../state/reducers/files';

function humanReadableBytes(bytes) {
  const kiloBytes = 1000;
  const megaBytes = 1000 * kiloBytes;

  if (bytes < kiloBytes) {
    return <>{bytes} bytes</>;
  } else if (bytes < megaBytes) {
    return <>{(bytes / kiloBytes).toFixed(2)} Kb</>;
  } else {
    return <>{(bytes / megaBytes).toFixed(2)} Mb</>;
  }
}

export default class FileUploader extends Component {
  render() {
    const {
      files,
      record,
      uploadFilesToDraft,
      deleteFileFromRecord,
      uploadButtonIcon,
      uploadButtonText,
      dragText,
    } = this.props;
    const dropzoneParams = {
      preventDropOnDocument: true,
      onDropAccepted: (files) => uploadFilesToDraft(record, files),
      multiple: true,
      noClick: true,
      noKeyboard: true,
    };
    let filesList = Object.values(files).map((fileState) => {
      return {
        fileName: fileState.fileName,
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

    return (
      <Dropzone {...dropzoneParams}>
        {({ getRootProps, getInputProps, open: openFileDialog }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Segment textAlign="center">
              <Grid celled="internally">
                <Grid.Row columns={1}>
                  {filesList.length !== 0 && (
                    <Grid.Column verticalAlign="middle">
                      <Table striped>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Filename</Table.HeaderCell>
                            <Table.HeaderCell>Size</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">
                              Progress
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">
                              Action
                            </Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          {filesList.map((file) => {
                            return (
                              <Table.Row
                                key={file.fileName}
                                className="file-table-row"
                              >
                                <Table.Cell>
                                  {file.fileName} <br />
                                  {file.checksum && (
                                    <div>
                                      <small className="file-checksum">
                                        {file.checksum}
                                      </small>{' '}
                                      <Popup
                                        content="This is the file fingerprint (MD5 checksum), which can be used to verify the file integrity."
                                        trigger={
                                          <Icon
                                            fitted
                                            name="help circle"
                                            size="small"
                                          />
                                        }
                                        inverted
                                      />
                                    </div>
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  {humanReadableBytes(file.size)}
                                </Table.Cell>
                                <Table.Cell>
                                  {file.upload && (
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
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                  {file.upload && file.upload.finished && (
                                    <Icon
                                      className="action"
                                      name="trash alternate outline"
                                      color="blue"
                                      onClick={() => deleteFileFromRecord(file)}
                                    />
                                  )}
                                  {file.upload && file.upload.ongoing && (
                                    <Button
                                      type="button"
                                      icon
                                      labelPosition="left"
                                      negative
                                      size="mini"
                                      onClick={() => file.upload.cancel()}
                                    >
                                      <Icon name="cancel" />
                                      Cancel
                                    </Button>
                                  )}
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </Table.Body>
                        <Table.Footer fullWidth>
                          <Table.Row>
                            <Table.HeaderCell colSpan="4">
                              <Button
                                type="button"
                                floated="right"
                                primary={true}
                                className="file-selection-btn"
                                icon={uploadButtonIcon}
                                content={uploadButtonText}
                                onClick={() => openFileDialog()}
                                disabled={openFileDialog === null}
                              />
                            </Table.HeaderCell>
                          </Table.Row>
                        </Table.Footer>
                      </Table>
                    </Grid.Column>
                  )}
                  {filesList.length === 0 && (
                    <Grid.Column verticalAlign="middle" width={16}>
                      <Header>{dragText}</Header>
                      <>
                        <Divider horizontal>Or</Divider>
                        <Button
                          type="button"
                          primary={true}
                          className="file-selection-btn"
                          icon={uploadButtonIcon}
                          content={uploadButtonText}
                          onClick={() => openFileDialog()}
                          disabled={openFileDialog === null}
                        />
                      </>
                    </Grid.Column>
                  )}
                </Grid.Row>
              </Grid>
            </Segment>
          </div>
        )}
      </Dropzone>
    );
  }
}

const fileDetailsShape = PropTypes.objectOf(
  PropTypes.shape({
    fileName: PropTypes.string,
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
};

FileUploader.defaultProps = {
  dragText: 'Drag and drop files here',
  uploadButtonText: 'Choose files',
  uploadButtonIcon: 'upload',
};
