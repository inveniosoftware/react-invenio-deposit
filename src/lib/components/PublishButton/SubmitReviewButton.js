// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next, Trans } from '@translations/i18next';
import _get from 'lodash/get';
import React, { Component } from 'react';
import { ActionButton } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Button, Icon, Modal } from 'semantic-ui-react';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../../DepositFormSubmitContext';

class SubmitReviewButtonComponent extends Component {
  static contextType = DepositFormSubmitContext;
  state = { isConfirmModalOpen: false };

  openConfirmModal = () => this.setState({ isConfirmModalOpen: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpen: false });

  handleSubmitReview = (event, formik) => {
    this.context.setSubmitContext(DepositFormSubmitActions.SUBMIT_REVIEW);
    formik.handleSubmit(event);
    this.closeConfirmModal();
  };

  isDisabled = (formik, numberOfFiles) => {
    const filesEnabled = _get(formik.values, 'files.enabled', false);
    const filesMissing = filesEnabled && !numberOfFiles;
    return formik.isSubmitting || filesMissing;
  };

  render() {
    const { actionState, communityState, numberOfFiles, ...uiProps } =
      this.props;

    const communityTitle = communityState.selected.metadata.title;
    const { isConfirmModalOpen } = this.state;

    return (
      <>
        <ActionButton
          isDisabled={(formik) => this.isDisabled(formik, numberOfFiles)}
          name="SubmitReview"
          onClick={this.openConfirmModal}
          positive
          icon
          labelPosition="left"
          {...uiProps}
        >
          {(formik) => (
            <>
              {formik.isSubmitting &&
              actionState === 'DRAFT_SUBMIT_REVIEW_STARTED' ? (
                <Icon size="large" loading name="spinner" />
              ) : (
                <Icon name="upload" />
              )}
              {i18next.t('Submit review')}
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
              <Trans>
                Are you sure you want submit this record for review to be
                included in the community <b>{{ communityTitle }}</b>?
              </Trans>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeConfirmModal} floated="left">
                {i18next.t('Cancel')}
              </Button>
              <ActionButton
                name="submitReview"
                onClick={this.handleSubmitReview}
                positive
                content={i18next.t('Submit review')}
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
  communityState: state.deposit.community,
  numberOfFiles: Object.values(state.files.entries).length,
});

export const SubmitReviewButton = connect(
  mapStateToProps,
  null
)(SubmitReviewButtonComponent);
