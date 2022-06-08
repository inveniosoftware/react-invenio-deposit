// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { FastField } from 'formik';
import { i18next } from '@translations/i18next';
import PropTypes from 'prop-types';

class ProtectionButtonsComponent extends Component {
  handlePublicButtonClick = (event, elemProps) => {
    const { formik, fieldPath } = this.props;
    formik.form.setFieldValue(fieldPath, 'public');
    // NOTE: We reset values, so if embargo filled and click Public,
    //       user needs to fill embargo again. Otherwise, lots of
    //       bookkeeping.
    formik.form.setFieldValue('access.embargo', {
      active: false,
    });
  };

  handleRestrictionButtonClick = (event, elemProps) => {
    const { formik, fieldPath } = this.props;
    formik.form.setFieldValue(fieldPath, 'restricted');
  };

  render() {
    const { active, disabled } = this.props;

    const publicColor = active ? { color: 'green' } : {};
    const restrictedColor = !active ? { color: 'red' } : {};

    return (
      <Button.Group widths="2">
        <Button
          {...publicColor}
          data-testid="protection-buttons-component-public"
          disabled={disabled}
          onClick={this.handlePublicButtonClick}
          active={active}
        >
          {i18next.t('Public')}
        </Button>
        <Button
          {...restrictedColor}
          data-testid="protection-buttons-component-restricted"
          active={!active}
          onClick={this.handleRestrictionButtonClick}
        >
          {i18next.t('Restricted')}
        </Button>
      </Button.Group>
    );
  }
}

ProtectionButtonsComponent.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

ProtectionButtonsComponent.defaultProps = {
  active: true,
  disabled: false,
};

export class ProtectionButtons extends Component {
  render() {
    const { fieldPath, active, disabled } = this.props;

    const changed = !active || disabled ? { changed: true } : {};
    return (
      <FastField
        {...changed}
        name={fieldPath}
        component={(formikProps) => (
          <ProtectionButtonsComponent formik={formikProps} {...this.props} />
        )}
      />
    );
  }
}
