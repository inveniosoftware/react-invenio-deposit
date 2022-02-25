// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import _get from 'lodash/get';
import React, { Component } from 'react';
import { ActionButton } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Button, Icon, Modal } from 'semantic-ui-react';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../DepositFormSubmitContext';
import { DRAFT_PUBLISH_STARTED } from '../state/types';
import { toCapitalCase } from '../utils';

export class PublishButtonComponent extends Component {
  static contextType = DepositFormSubmitContext;
  state = { isConfirmModalOpen: false };

  openConfirmModal = () => this.setState({ isConfirmModalOpen: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpen: false });

  handlePublish = (event, formik) => {
    this.context.setSubmitContext(DepositFormSubmitActions.PUBLISH);
    formik.handleSubmit(event);
    this.closeConfirmModal();
  };

  isDisabled = (formik, numberOfFiles) => {
    const filesEnabled = _get(formik.values, 'files.enabled', false);
    const filesMissing = filesEnabled && !numberOfFiles;
    return formik.isSubmitting || filesMissing;
  };

  render() {
    const { actionState, publishClick, numberOfFiles, ...uiProps } = this.props;

    const { isConfirmModalOpen } = this.state;

    const action = i18next.t('publish');
    const capitalizedAction = toCapitalCase(action);
    return (
      <>
        <ActionButton
          isDisabled={(formik) => this.isDisabled(formik, numberOfFiles)}
          name="publish"
          onClick={this.openConfirmModal}
          positive
          icon
          labelPosition="left"
          {...uiProps}
        >
          {(formik) => (
            <>
              {formik.isSubmitting && actionState === DRAFT_PUBLISH_STARTED ? (
                <Icon size="large" loading name="spinner" />
              ) : (
                <Icon name="upload" />
              )}
              {capitalizedAction}
            </>
          )}
        </ActionButton>
        {isConfirmModalOpen && (
          <Modal
            open={isConfirmModalOpen}
            onClose={this.closeConfirmModal}
            size="small"
          >
            <Modal.Content>
              <h3>
                {i18next.t(`Are you sure you want to {{action}} this record?`, {
                  action: action,
                })}
              </h3>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeConfirmModal} floated="left">
                Cancel
              </Button>
              <ActionButton
                name="publish"
                onClick={this.handlePublish}
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
  actionState: state.deposit.actionState,
  numberOfFiles: Object.values(state.files.entries).length,
});

export const PublishButton = connect(
  mapStateToProps,
  null
)(PublishButtonComponent);
