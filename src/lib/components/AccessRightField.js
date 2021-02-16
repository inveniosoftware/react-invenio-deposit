// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FastField } from 'formik';
import { FieldLabel } from 'react-invenio-forms';
import { Card, Divider, Form } from 'semantic-ui-react';

import { Embargo, EmbargoState, Embargoed, EmbargoedFiles, Public, Restricted, RestrictedFiles } from "./Access";


class Protection {
  static create(access, hasFiles) {
    const embargo = new Embargo({
      state: EmbargoState.from(access),
      date: access.embargo.until,
      reason: access.embargo.reason
    });

    if (access.record === "public") {
      if (hasFiles) {
        if (access.files === "public") {
          return new Public(hasFiles, embargo);
        } else if (embargo.is(EmbargoState.APPLIED)) {
          return new EmbargoedFiles(embargo);
        } else {
          return new RestrictedFiles(embargo);
        }
      }

      if (!hasFiles) {
        return new Public(hasFiles, embargo);
      }
    } else if (access.record === "restricted") {
      if (embargo.is(EmbargoState.APPLIED)) {
        return new Embargoed(hasFiles, embargo);
      } else {
        return new Restricted(hasFiles, embargo);
      }
    }
  }
}


function convertToNewFormat(access) {
  let record;
  if (access.record && ["public", "restricted"].includes(access.record)) {
    record = access.record;
  } else {
    record = access.metadata ? "restricted" : "public";
  }
  let files;
  if (access.files && ["public", "restricted"].includes(access.files)) {
    files = access.files;
  } else {
    files = access.files ? "restricted" : "public";
  }

  return {
    record,
    files,
    owned_by: access.owned_by,
    embargo: access.embargo ? access.embargo : {
      "active": false,
      "until": "",
      "reason": ""
    },
    grants: access.grants ? access.grants : []
  }
}

export class AccessRightFieldComponent extends Component {
  /** Top-level Access Right Component */

  render() {
    const {
      fieldPath,
      formik,  // this is our access to the shared current draft
      hasFiles,
      label,
      labelIcon,
    } = this.props;

    // value of access field
    // temporarily convert to upcoming backend format
    const access = convertToNewFormat(formik.field.value);
    const protection = Protection.create(access, hasFiles);

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

            <p><b>Options</b></p>
            <Divider />

            {protection.renderEmbargoSection()}

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
    // This way, FastField only renders when the things (access and hasFiles)
    // it cares about change as it should be.
    const change = this.props.hasFiles ? {change: true} : {}
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
  hasFiles: PropTypes.bool,
};

FormikAccessRightField.defaultProps = {
  fieldPath: 'access',
};


const mapStateToProps = (state) => ({
  hasFiles: Object.values(state.files.entries).length > 0,
});


export const AccessRightField = connect(
  mapStateToProps,
  null
)(FormikAccessRightField);
