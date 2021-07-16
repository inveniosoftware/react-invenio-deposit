// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FieldLabel, TextField } from 'react-invenio-forms';
import { i18next } from '@translations/i18next';
import { Trans } from 'react-i18next';

export class VersionField extends Component {
  render() {
    const { fieldPath, label, labelIcon, placeholder } = this.props;
    const helpText = (
      <span>
        <Trans>
          Mostly relevant for software and dataset uploads. A semantic version
          string is preferred see
          <a href="https://semver.org/" target="_blank">
            {' '}
            semver.org
          </a>
          , but any version string is accepted.
        </Trans>
      </span>
    );

    return (
      <TextField
        fieldPath={fieldPath}
        helpText={helpText}
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        placeholder={placeholder}
      />
    );
  }
}

VersionField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  placeholder: PropTypes.string,
};

VersionField.defaultProps = {
  fieldPath: 'metadata.version',
  label: i18next.t('Version'),
  labelIcon: 'code branch',
  placeholder: '',
};
