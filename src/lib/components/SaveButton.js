// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { ActionButton } from 'react-invenio-forms';

import { submitAction } from '../state/actions';
import { FORM_SAVING } from '../state/types';

export class SaveButtonComponent extends Component {

  isDisabled = (formik) => {
    return formik.isSubmitting;
  };

  render() {
    const { formState, saveClick, ...uiProps } = this.props;

    return (
      <ActionButton
        isDisabled={this.isDisabled}
        name="save"
        onClick={saveClick}
        icon
        labelPosition="left"
        {...uiProps}
      >
        {(formik) => (
          <>
            { ( formik.isSubmitting && formState === FORM_SAVING ) ? (
              <Icon size="large" loading name="spinner" />
            ) : (
              <Icon name="save" />
            )}
            Save draft
          </>
        )}
      </ActionButton>
    );
  }
}

const mapStateToProps = (state) => ({
  formState: state.deposit.formState,
});

const mapDispatchToProps = (dispatch) => ({
  saveClick: (event, formik) =>
    dispatch(submitAction(FORM_SAVING, event, formik)),
});

export const SaveButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveButtonComponent);
