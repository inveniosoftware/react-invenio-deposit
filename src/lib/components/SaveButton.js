// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2022 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import React, { Component } from 'react';
import { ActionButton } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../DepositFormSubmitContext';
import { DRAFT_SAVE_STARTED } from '../state/types';
import { scrollTop } from '../utils';

export class SaveButtonComponent extends Component {
  static contextType = DepositFormSubmitContext;

  handleSave = (event, formik) => {
    this.context.setSubmitContext(DepositFormSubmitActions.SAVE);
    formik.handleSubmit(event);
    scrollTop();
  };

  render() {
    const { actionState, ...uiProps } = this.props;

    return (
      <ActionButton
        isDisabled={(formik) => formik.isSubmitting}
        name="save"
        onClick={this.handleSave}
        icon
        labelPosition="center"
        {...uiProps}
      >
        {(formik) => (
          <>
            {formik.isSubmitting && actionState === DRAFT_SAVE_STARTED ? (
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
  actionState: state.deposit.actionState,
});

export const SaveButton = connect(mapStateToProps, null)(SaveButtonComponent);
