// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { ActionButton } from 'react-invenio-forms';

import { submitAction } from '../state/actions';
import {
  FORM_SAVE_FAILED,
  FORM_SAVE_PARTIALLY_SUCCEEDED,
  FORM_SAVE_SUCCEEDED,
  FORM_SAVING,
} from '../state/types';

export class PreviewButtonComponent extends Component {
  state = {
    isLoading: false,
    previewButtonClicked: false,
    previousFormState: '',
  };

  isDisabled = (formik) => {
    return formik.isSubmitting;
  };

  render() {
    const { record, saveClick, formState, ...uiProps } = this.props;
    const { isLoading, previewButtonClicked, previousFormState } = this.state;
    if (previewButtonClicked && formState !== previousFormState) {
      switch (formState) {
        case FORM_SAVING:
          this.setState({ previousFormState: formState });
          break;
        case FORM_SAVE_SUCCEEDED:
          window.location = `/records/${record.id}?preview=1`;
          break;
        case FORM_SAVE_PARTIALLY_SUCCEEDED:
        case FORM_SAVE_FAILED:
          this.setState({
            isLoading: false,
            previewButtonClicked: false,
            previousFormState: formState,
          });
          break;
        default:
      }
    }

    return (
      <ActionButton
        name="preview"
        isDisabled={this.isDisabled}
        onClick={(event, formik) => {
          saveClick(event, formik);
          this.setState({
            isLoading: true,
            previewButtonClicked: true,
          });
        }}
        icon
        labelPosition="left"
        {...uiProps}
      >
        {(formik) => (
          <>
            {formik.isSubmitting && isLoading ? (
              <Icon size="large" loading name="spinner" />
            ) : (
              <Icon name="eye" />
            )}
            Preview
          </>
        )}
      </ActionButton>
    );
  }
}

const mapStateToProps = (state) => ({
  formState: state.deposit.formState,
  record: state.deposit.record,
});

const mapDispatchToProps = (dispatch) => ({
  saveClick: (event, formik) =>
    dispatch(submitAction(FORM_SAVING, event, formik)),
});

export const PreviewButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewButtonComponent);
