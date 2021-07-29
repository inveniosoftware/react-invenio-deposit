// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { ActionButton } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { submitAction } from '../state/actions';
import { FORM_SAVING } from '../state/types';
import { i18next } from '@translations/i18next';

export class SaveButtonComponent extends Component {
  isDisabled = (formik) => {
    return formik.isSubmitting;
  };

  render() {
    const { formState, saveClick, ...uiProps } = this.props;

    function handleClick(e, formik) {
      saveClick(e, formik);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }

    return (
      <ActionButton
        isDisabled={this.isDisabled}
        name="save"
        onClick={handleClick}
        icon
        labelPosition="center"
        {...uiProps}
      >
        {(formik) => (
          <>
            {formik.isSubmitting && formState === FORM_SAVING ? (
              <Icon size="large" loading name="spinner" />
            ) : (
              <Icon name="save" />
            )}
            {i18next.t('Save draft')}
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
