// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C)      2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FastField } from 'formik';
import { FieldLabel } from 'react-invenio-forms';
import { Card, Divider, Form } from 'semantic-ui-react';
import { i18next } from '../i18next';
import {
  Embargo,
  EmbargoState,
  Embargoed,
  EmbargoedFiles,
  EmbargoedMetadataOnly,
  PublicFiles,
  PublicMetadataOnly,
  Restricted,
  RestrictedFiles,
  RestrictedMetadataOnly,
} from './Access';

class Protection {
  static create(access, isMetadataOnly) {
    const embargo = new Embargo({
      state: EmbargoState.from(access),
      date: access.embargo ? access.embargo.until : '',
      reason: access.embargo ? access.embargo.reason : '',
    });
    if (access.record === 'public') {
      if (isMetadataOnly) {
        return new PublicMetadataOnly(embargo);
      } else if (access.files === 'public') {
        return new PublicFiles(embargo);
      } else if (embargo.is(EmbargoState.APPLIED)) {
        return new EmbargoedFiles(embargo);
      } else {
        return new RestrictedFiles(embargo); // technically no embargo
      }
    } else {
      if (isMetadataOnly) {
        if (embargo.is(EmbargoState.APPLIED)) {
          return new EmbargoedMetadataOnly(embargo);
        } else {
          return new RestrictedMetadataOnly(embargo); // technically no embargo
        }
      } else if (embargo.is(EmbargoState.APPLIED)) {
        return new Embargoed(embargo);
      } else {
        return new Restricted(embargo); // technically no embargo
      }
    }
  }
}

class AccessRightFieldComponent extends Component {
  /** Top-level Access Right Component */

  render() {
    const {
      fieldPath,
      formik, // this is our access to the shared current draft
      isMetadataOnly,
      label,
      labelIcon,
    } = this.props;

    const protection = Protection.create(formik.field.value, isMetadataOnly);

    return (
      <Card className="access-right">
        <Card.Content>
          <Form.Field required>
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />

            {protection.renderMetadataSection()}

            <Divider hidden />

            {protection.renderFilesSection()}

            <Divider hidden />

            {protection.renderMessageSection()}

            <Divider hidden />

            <p>
              <b>{i18next.t('Options')}</b>
            </p>
            <Divider />

            {protection.renderEmbargoSection(formik.form.initialValues.access)}
          </Form.Field>
        </Card.Content>
      </Card>
    );
  }
}

class FormikAccessRightField extends Component {
  render() {
    // NOTE: This is a "cute" optimization.
    //       In general, FastField only re-renders if
    //       * formik slice associated with this.props.fieldPath changes
    //         (i.e. `access` changes)
    //       * props are ADDED or REMOVED to FastField
    // So we add/remove a prop to FastField based on the presence of files.
    // This way, FastField only renders when the things (access and isMetadataOnly)
    // it cares about change, as it should be.
    const change = this.props.isMetadataOnly ? { change: true } : {};
    return (
      <FastField
        name={this.props.fieldPath}
        component={(formikProps) => (
          <AccessRightFieldComponent formik={formikProps} {...this.props} />
        )}
        {...change}
      />
    );
  }
}

FormikAccessRightField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string,
  isMetadataOnly: PropTypes.bool,
};

FormikAccessRightField.defaultProps = {
  fieldPath: 'access',
};

const mapStateToProps = (state) => ({
  isMetadataOnly: !state.deposit.record.files.enabled,
});

export const AccessRightField = connect(
  mapStateToProps,
  null
)(FormikAccessRightField);
