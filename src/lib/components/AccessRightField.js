// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field } from 'formik';
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
      formik,  // this is our access to the shared current draft
      fieldPath,
      label,
      labelIcon,
    } = this.props;

    // value of access field
    // temporarily convert to upcoming backend format
    const access = convertToNewFormat(formik.field.value)

    // External
    // TODO: replace by redux access to hasFiles
    const tmpHasFiles = true;

    const protection = Protection.create(access, tmpHasFiles);

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

export class AccessRightField extends Component {
  render() {
    return (
      <FastField
        name={this.props.fieldPath}
        component={(formikProps) => (
          <AccessRightFieldComponent formik={formikProps} {...this.props} />
        )}
      />
    );
  }
}

AccessRightField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string,
};

AccessRightField.defaultProps = {
  fieldPath: 'access',
};
