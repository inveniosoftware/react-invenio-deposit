// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Modal } from 'semantic-ui-react';
import { ActionButton } from 'react-invenio-forms';
import { FORM_PUBLISHING, FORM_SAVE_SUCCEEDED } from '../../state/types';

export default class PublishButton extends Component {
  state = { confirmOpen: false };

  onPublishClick = (event, formik) => {
    this.props.publishClick(event, formik);
    this.setState({ confirmOpen: false });
  };

  confirmPublish = () => this.setState({ confirmOpen: true });

  handleClose = () => this.setState({ confirmOpen: false });

  render() {
    const {
      formState,
      publishClick,
      filesEnabled,
      numberOfFiles,
      ...uiProps
    } = this.props;

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

    return (
      <>
        <ActionButton
          isDisabled={isDisabled}
          name="publish"
          onClick={this.confirmPublish}
          positive
          {...uiProps}
        >
          {(formik) => (
            <>
              {formik.isSubmitting && formState === FORM_PUBLISHING && (
                <Icon size="large" loading name="spinner" />
              )}
              Publish
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
              <h3>Are you sure you want to publish this record?</h3>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.handleClose} floated="left">
                Cancel
              </Button>
              <ActionButton
                name="publish"
                onClick={this.onPublishClick}
                positive
                content="Publish"
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    );
  }
}

PublishButton.propTypes = {};
