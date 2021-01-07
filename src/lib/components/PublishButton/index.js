// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { connect } from 'react-redux';
import { submitAction } from '../../state/actions';
import PublishButtonComponent from './PublishButton';
import { FORM_PUBLISHING } from '../../state/types';

const mapStateToProps = (state) => ({
  formState: state.deposit.formState,
  filesEnabled: state.files.enabled,
  numberOfFiles: Object.values(state.files.entries).length,
});

const mapDispatchToProps = (dispatch) => ({
  publishClick: (event, formik) =>
    dispatch(submitAction(FORM_PUBLISHING, event, formik)),
});

export const PublishButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishButtonComponent);
