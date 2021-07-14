// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldLabel, RemoteSelectField } from 'react-invenio-forms';
import { i18next } from '../i18next';

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
      ...uiProps
    } = this.props;
    const serializeSuggestions = this.props.serializeSuggestions || null;
    return (
      <RemoteSelectField
        fieldPath={fieldPath}
        suggestionAPIUrl="/api/vocabularies/languages"
        suggestionAPIHeaders={{
          Accept: 'application/vnd.inveniordm.v1+json',
        }}
        placeholder={placeholder}
        required={required}
        clearable={clearable}
        multiple={multiple}
        initialSuggestions={initialOptions}
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        noQueryMessage={i18next.t('Search for languages...')}
        {...(serializeSuggestions && { serializeSuggestions })}
        {...uiProps}
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
  label: i18next.t('Languages'),
  labelIcon: 'globe',
  multiple: true,
  clearable: true,
  placeholder: i18next.t(
    'Search for a language by name (e.g "eng", "fr" or "Polish")'
  ),
};
