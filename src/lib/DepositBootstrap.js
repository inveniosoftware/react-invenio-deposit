// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BaseForm } from 'react-invenio-forms';
import { submitFormData } from './state/actions';

class DepositBootstrapComponent extends Component {
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

  render() {
    return (
      <BaseForm
        onSubmit={this.props.submitFormData}
        formik={{
          enableReinitialize: true, // Needed for files
          initialValues: this.props.record,
          ...(this.props.errors && { initialErrors: this.props.errors }), // Needed because of enableReinitialize
        }}
      >
        {this.props.children}
      </BaseForm>
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
  submitFormData: (values, formik) => dispatch(submitFormData(values, formik)),
});

export const DepositBootstrap = connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositBootstrapComponent);
