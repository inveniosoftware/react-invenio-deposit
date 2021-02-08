// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Modal } from 'semantic-ui-react';
import { ActionButton } from 'react-invenio-forms';

import { submitAction } from '../state/actions';
import { FORM_PUBLISHING, FORM_SAVE_SUCCEEDED } from '../state/types';
import { toCapitalCase } from '../utils';

export class PublishButtonComponent extends Component {
  state = { confirmOpen: false };

  handleOpen = () => this.setState({ confirmOpen: true });

  handleClose = () => this.setState({ confirmOpen: false });

  render() {
    const {
      formState,
      publishClick,
      filesEnabled,
      numberOfFiles,
      ...uiProps
    } = this.props;

    const handlePublish = (event, formik) => {
      publishClick(event, formik);
      this.handleClose();
    };


    const isDisabled = () => {
      const noFilesUploaded = !numberOfFiles;
      // Files are broken if you publish without either uploading a file
      // or explicitely mark the draft as "Metadata only"
      // Temporarely disable publish also in that case until the backend
      // can validate it correctly and report back errors on partial save
      return (
        formState !== FORM_SAVE_SUCCEEDED || (filesEnabled && noFilesUploaded)
      );
    };

    const action = "publish";
    const capitalizedAction = toCapitalCase(action);

    return (
      <>
        <ActionButton
          isDisabled={isDisabled}
          name="publish"
          onClick={this.handleOpen}
          positive
          icon
          labelPosition="left"
          {...uiProps}
        >
          {(formik) => (
            <>
              { ( formik.isSubmitting && formState === FORM_PUBLISHING ) ? (
                <Icon size="large" loading name="spinner" />
              ) : (
                <Icon name="upload" />
              )}
              {capitalizedAction}
            </>
          )}
        </ActionButton>
        {this.state.confirmOpen && (
          <Modal
            open={this.state.confirmOpen}
            onClose={this.handleClose}
            size="small"
          >
            <Modal.Content>
              <h3>Are you sure you want to {action} this record?</h3>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.handleClose} floated="left">
                Cancel
              </Button>
              <ActionButton
                name="publish"
                onClick={handlePublish}
                positive
                content={capitalizedAction}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  formState: state.deposit.formState,
  filesEnabled: state.files.enabled,
  numberOfFiles: Object.values(state.files.entries).length,
});

const mapDispatchToProps = (dispatch) => ({
  publishClick: (event, formik) =>
    dispatch(submitAction(FORM_PUBLISHING, event, formik)),
});

export const PublishButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishButtonComponent);
