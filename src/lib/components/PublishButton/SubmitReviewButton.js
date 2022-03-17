// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import _get from 'lodash/get';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { connect as connectFormik } from 'formik';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../../DepositFormSubmitContext';
import { ActionButton } from 'react-invenio-forms';
import { SubmitReviewModal } from './SubmitReviewModal';

class SubmitReviewButtonComponent extends Component {
  static contextType = DepositFormSubmitContext;
  state = { isConfirmModalOpen: false };

  openConfirmModal = () => this.setState({ isConfirmModalOpen: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpen: false });

  handleSubmitReview = ({ reviewComment }) => {
    this.context.setSubmitContext(DepositFormSubmitActions.SUBMIT_REVIEW, {
      reviewComment,
    });
    this.props.formik.handleSubmit();
    this.closeConfirmModal();
  };

  isDisabled = (formik, numberOfFiles) => {
    const filesEnabled = _get(formik.values, 'files.enabled', false);
    const filesMissing = filesEnabled && !numberOfFiles;
    return formik.isSubmitting || filesMissing;
  };

  render() {
    const {
      actionState,
      actionStateExtra,
      communityState,
      numberOfFiles,
      ...uiProps
    } = this.props;

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
          <SubmitReviewModal
            isConfirmModalOpen={isConfirmModalOpen}
            initialReviewComment={actionStateExtra.reviewComment}
            onSubmit={this.handleSubmitReview}
            communityTitle={communityTitle}
            onClose={this.closeConfirmModal}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  actionState: state.deposit.actionState,
  actionStateExtra: state.deposit.actionStateExtra,
  communityState: state.deposit.community,
  numberOfFiles: Object.values(state.files.entries).length,
});

export const SubmitReviewButton = connect(
  mapStateToProps,
  null
)(connectFormik(SubmitReviewButtonComponent));
