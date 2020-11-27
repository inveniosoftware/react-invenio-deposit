// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { connect } from 'react-redux';
import { submitAction } from '../../state/actions';
import PublishButtonComponent from './PublishButton';

const mapStateToProps = (state) => ({
  formAction: state.deposit.formAction,
  fileUploadOngoing: state.files.isFileUploadInProgress,
  filesEnabled: state.files.enabled,
  nubmerOfFiles: Object.values(state.files.entries).length,
});

const mapDispatchToProps = (dispatch) => ({
  publishClick: (event, formik) =>
    dispatch(submitAction('publish', event, formik)),
});

export const PublishButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishButtonComponent);
