// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Modal } from 'semantic-ui-react';
import { ActionButton } from 'react-invenio-forms';

import { submitAction } from '../state/actions';
import { FORM_PUBLISHING } from '../state/types';
import { toCapitalCase } from '../utils';

export class PublishButtonComponent extends Component {
  state = { confirmOpen: false };

  handleOpen = () => this.setState({ confirmOpen: true });

  handleClose = () => this.setState({ confirmOpen: false });

  render() {
    const {
      formState,
      publishClick,
      numberOfFiles,
      errors,
      ...uiProps
    } = this.props;

    const handlePublish = (event, formik) => {
      publishClick(event, formik);
      this.handleClose();
    };

    const isDisabled = (formik) => {
      const filesEnabled = _get(formik.values, "files.enabled", false);
      const filesMissing = filesEnabled && !numberOfFiles;
      const hasErrors = !_isEmpty(errors);
      return formik.isSubmitting || hasErrors || filesMissing;
    };

    const action = 'publish';
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
              {formik.isSubmitting && formState === FORM_PUBLISHING ? (
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
  numberOfFiles: Object.values(state.files.entries).length,
  errors: state.deposit.errors,
});

const mapDispatchToProps = (dispatch) => ({
  publishClick: (event, formik) =>
    dispatch(submitAction(FORM_PUBLISHING, event, formik)),
});

export const PublishButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishButtonComponent);
