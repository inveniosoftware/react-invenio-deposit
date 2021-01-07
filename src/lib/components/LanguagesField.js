// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldLabel, RemoteSelectField } from 'react-invenio-forms';

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
      initialOptions,
    } = this.props;
    const serializeSuggestions = this.props.serializeSuggestions || null;
    return (
      <RemoteSelectField
        fieldPath={fieldPath}
        suggestionAPIUrl="/api/vocabularies/languages"
        placeholder={placeholder}
        required={required}
        clearable={clearable}
        multiple={multiple}
        initialSuggestions={initialOptions}
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        noQueryMessage="Search for languages..."
        {...(serializeSuggestions && { serializeSuggestions })}
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
  initialOptions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      text: PropTypes.string,
    })
  ),
  serializeSuggestions: PropTypes.func,
};

LanguagesField.defaultProps = {
  fieldPath: 'metadata.languages',
  label: 'Languages',
  labelIcon: 'globe',
  multiple: true,
  clearable: true,
  placeholder: 'Search for a language by name (e.g "eng", "fr" or "Polish")',
};
