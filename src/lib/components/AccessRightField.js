// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import { FieldLabel } from 'react-invenio-forms';
import { Card, Divider, Form } from 'semantic-ui-react';

import { Embargo, Embargoed, EmbargoedFiles, Public, Restricted, RestrictedFiles } from "./Access";


class Protection {
  static create(
    metadataPublic,
    filesPublic,
    hasFiles,
    embargo
  ) {

    if (metadataPublic) {
      if (hasFiles) {
        if (filesPublic) {
          return new Public(hasFiles, embargo);
        } else if (embargo.is(Embargo.APPLIED)) {
          return new EmbargoedFiles(embargo);
        } else {
          return new RestrictedFiles(embargo);
        }
      }

      if (!hasFiles) {
        return new Public(hasFiles, embargo);
      }
    }

    if (!metadataPublic) {
      if (embargo.is(Embargo.APPLIED)) {
        return new Embargoed(hasFiles, embargo);
      } else {
        return new Restricted(hasFiles, embargo);
      }
    }
  }
}


export class AccessRightField extends Component {
  /** Top-level Access Right Component */

  render() {
    const { fieldPath, label, labelIcon, options } = this.props;

    // External
    // TODO: replace by Formik access field slice
    const tmpMetadataPublic = false;
    const tmpHasFiles = true;
    const tmpFilesPublic = false;
    const tmpisEmbargoApplied = false;
    const tmpEmbargoDate = "2021-06-21";
    const tmpEmbargoLifted = false;
    const tmpEmbargoReason = "";


    const embargoState = Embargo.stateFrom(
      tmpMetadataPublic,
      tmpFilesPublic,
      tmpisEmbargoApplied,
      tmpEmbargoLifted
    );

    const protection = Protection.create(
      // TODO: replace by Formik access field slice
      tmpMetadataPublic,
      tmpFilesPublic,
      tmpHasFiles,
      new Embargo({state: embargoState, date: tmpEmbargoDate, reason: tmpEmbargoReason})
    );

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

AccessRightField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string,
  options: PropTypes.array,
};

AccessRightField.defaultProps = {
  fieldPath: 'access.access_right',
};
