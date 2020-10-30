// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldLabel, SelectField } from 'react-invenio-forms';

export class LanguagesField extends Component {
  render() {
    const { fieldPath, label, labelIcon, options, required } = this.props;
    return (
      <SelectField
        fieldPath={fieldPath}
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        options={options}
        placeholder={'Select languages...'}
        multiple
        search
        required={required}
      />
    );
  }
}

LanguagesField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  required: PropTypes.bool,
};

LanguagesField.defaultProps = {
  fieldPath: 'metadata.languages',
  label: 'Languages',
  labelIcon: 'globe',
};
