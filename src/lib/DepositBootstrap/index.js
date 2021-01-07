// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { connect } from 'react-redux';
import { submitFormData } from '../state/actions';
import DepositBootstrapComponent from './DepositBootstrap';

const mapStateToProps = (state) => {
  const { isFileUploadInProgress, ...files } = state.files;
  return {
    record: state.deposit.record,
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
