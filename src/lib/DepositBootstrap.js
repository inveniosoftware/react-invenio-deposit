// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { BaseForm } from 'react-invenio-forms';
import { connect } from 'react-redux';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from './DepositFormSubmitContext';
import {
  delete_,
  discardPID,
  preview,
  publish,
  reservePID,
  save,
  submitReview,
} from './state/actions';
import { scrollTop } from './utils';

class DepositBootstrapComponent extends Component {
  submitContext = undefined;

  componentDidMount() {
    window.addEventListener('beforeunload', (e) => {
      if (this.props.fileUploadOngoing) {
        e.returnValue = '';
        return '';
      }
    });
    window.addEventListener('unload', async (e) => {
      // TODO: cancel all uploads
      // Investigate if it's possible to wait for the deletion request to complete
      // before unloading the page
    });
  }

  setSubmitContext = (actionName, extra = {}) => {
    this.submitContext = {
      actionName: actionName,
      extra: extra,
    };
  };

  onFormSubmit = async (values, formikBag) => {
    const {
      saveAction,
      publishAction,
      submitReview,
      previewAction,
      deleteAction,
      reservePIDAction,
      discardPIDAction,
    } = this.props;
    const { actionName, extra } = this.submitContext;

    let actionFunc = undefined;
    const params = {};
    switch (actionName) {
      case DepositFormSubmitActions.SAVE:
        actionFunc = saveAction;
        break;
      case DepositFormSubmitActions.PUBLISH:
        actionFunc = publishAction;
        break;
      case DepositFormSubmitActions.PUBLISH_WITHOUT_COMMUNITY:
        actionFunc = publishAction;
        params['withoutCommunity'] = true;
        break;
      case DepositFormSubmitActions.SUBMIT_REVIEW:
        actionFunc = submitReview;
        params['reviewComment'] = extra['reviewComment'];
        break;
      case DepositFormSubmitActions.PREVIEW:
        actionFunc = previewAction;
        break;
      case DepositFormSubmitActions.DELETE:
        actionFunc = deleteAction;
        params['isDiscardingVersion'] = extra['isDiscardingVersion'];
        break;
      case DepositFormSubmitActions.RESERVE_PID:
        actionFunc = reservePIDAction;
        params['pidType'] = extra['pidType'];
        break;
      case DepositFormSubmitActions.DISCARD_PID:
        actionFunc = discardPIDAction;
        params['pidType'] = extra['pidType'];
        break;
      default:
        throw Error('The submit btn must set the form action name.');
    }

    try {
      await actionFunc(values, params);
    } catch (error) {
      // make sure the error contains form errors, and not global errors.
      if (error && error.errors) {
        formikBag.setErrors(error.errors);
      } else {
        // scroll top to show the global error
        scrollTop();
      }
    } finally {
      // reset the action name after having handled it
      this.submitContext = {};
    }
  };

  render() {
    return (
      <DepositFormSubmitContext.Provider
        value={{ setSubmitContext: this.setSubmitContext }}
      >
        <BaseForm
          onSubmit={this.onFormSubmit}
          formik={{
            initialValues: this.props.record,
            ...(this.props.errors && { initialErrors: this.props.errors }), // Needed because of enableReinitialize
          }}
        >
          {this.props.children}
        </BaseForm>
      </DepositFormSubmitContext.Provider>
    );
  }
}

const mapStateToProps = (state) => {
  const { isFileUploadInProgress, ...files } = state.files;
  return {
    record: state.deposit.record,
    errors: state.deposit.errors,
    formState: state.deposit.formState,
    fileUploadOngoing: isFileUploadInProgress,
    files: files,
  };
};

const mapDispatchToProps = (dispatch) => ({
  publishAction: (values, { withoutCommunity = false }) =>
    dispatch(publish(values, { withoutCommunity })),
  submitReview: (values, { reviewComment }) =>
    dispatch(submitReview(values, { reviewComment })),
  saveAction: (values) => dispatch(save(values)),
  previewAction: (values) => dispatch(preview(values)),
  deleteAction: (values, { isDiscardingVersion }) =>
    dispatch(delete_(values, { isDiscardingVersion })),
  reservePIDAction: (values, { pidType }) =>
    dispatch(reservePID(values, { pidType })),
  discardPIDAction: (values, { pidType }) =>
    dispatch(discardPID(values, { pidType })),
});

export const DepositBootstrap = connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositBootstrapComponent);
