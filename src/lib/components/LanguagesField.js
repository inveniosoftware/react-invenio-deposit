// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldLabel, RemoteSelectField } from 'react-invenio-forms';

//TODO: remove after backend will be implemented
const fetchedOptions = [
  { title: 'Danish', id: 'dan' },
  { title: 'English', id: 'eng' },
  { title: 'French', id: 'fra' },
  { title: 'German', id: 'deu' },
  { title: 'Greek', id: 'ell' },
  { title: 'Italian', id: 'ita' },
  { title: 'Spanish', id: 'spa' },
];

export class LanguagesField extends Component {
  render() {
    const {
      fieldPath,
      label,
      labelIcon,
      required,
      multiple,
      placeholder,
      clearable,
    } = this.props;
    return (
      <RemoteSelectField
        fieldPath={fieldPath}
        suggestionAPIUrl="/api/vocabularies/languages"
        placeholder={placeholder}
        required={required}
        clearable={clearable}
        multiple={multiple}
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        noQueryMessage="Search for languages..."
        fetchedOptions={fetchedOptions}
      />
    );
  }
}

LanguagesField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  clearable: PropTypes.bool,
  placeholder: PropTypes.string,
};

LanguagesField.defaultProps = {
  fieldPath: 'metadata.languages',
  label: 'Languages',
  labelIcon: 'globe',
  multiple: true,
  clearable: true,
  placeholder: 'Search for a language by name (e.g "eng", "fr" or "Polish")',
};
