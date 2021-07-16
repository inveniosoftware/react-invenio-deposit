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

export class PublicationDateField extends Component {
  render() {
    const { fieldPath, label, labelIcon, placeholder, required } = this.props;

    return (
      <TextField
        fieldPath={fieldPath}
        helpText={i18next.t(
          'In case your upload was already published elsewhere, please use the date of the first publication. Format: YYYY-MM-DD, YYYY-MM, or YYYY. For intervals use DATE/DATE, e.g. 1939/1945.'
        )}
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        placeholder={placeholder}
        required={required}
      />
    );
  }
}

PublicationDateField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

PublicationDateField.defaultProps = {
  fieldPath: 'metadata.publication_date',
  label: i18next.t('Publication date'),
  labelIcon: 'calendar',
  placeholder: i18next.t(
    'YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD for intervals. MM and DD are optional.'
  ),
};
