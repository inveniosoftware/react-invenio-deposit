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
    const { fieldPath, label, labelIcon, required } = this.props;
    return (
      <RemoteSelectField
        fieldPath={fieldPath}
        suggestionAPIUrl="/api/vocabularies/languages"
        placeholder={'Select languages...'}
        required={required}
        multiple
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        noQueryMessage="Search for languages..."
      />
    );
  }
}

LanguagesField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
};

LanguagesField.defaultProps = {
  fieldPath: 'metadata.languages',
  label: 'Languages',
  labelIcon: 'globe',
};
