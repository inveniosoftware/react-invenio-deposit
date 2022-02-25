// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
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
import { DRAFT_PREVIEW_STARTED } from '../state/types';

export class PreviewButtonComponent extends Component {
  static contextType = DepositFormSubmitContext;

  handlePreview = (event, formik) => {
    this.context.setSubmitContext(DepositFormSubmitActions.PREVIEW);
    formik.handleSubmit(event);
  };

  render() {
    const { record, actionState, ...uiProps } = this.props;

    return (
      <ActionButton
        name="preview"
        isDisabled={(formik) => formik.isSubmitting}
        onClick={this.handlePreview}
        icon
        labelPosition="center"
        {...uiProps}
      >
        {(formik) => (
          <>
            {formik.isSubmitting && actionState === DRAFT_PREVIEW_STARTED ? (
              <Icon size="large" loading name="spinner" />
            ) : (
              <Icon name="eye" />
            )}
            {i18next.t('Preview')}
          </>
        )}
      </ActionButton>
    );
  }
}

const mapStateToProps = (state) => ({
  actionState: state.deposit.actionState,
  record: state.deposit.record,
});

export const PreviewButton = connect(
  mapStateToProps,
  null
)(PreviewButtonComponent);
