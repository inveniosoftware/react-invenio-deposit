// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FieldLabel, TextField } from 'react-invenio-forms';

export class CitationField extends Component {
  render() {
    const { fieldPath, label, placeholder } = this.props;

    return (
      <TextField
        fieldPath={fieldPath}
        label={<FieldLabel htmlFor={fieldPath} />}
        placeholder={placeholder}
      />
    );
  }
}

CitationField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

CitationField.defaultProps = {
  fieldPath: 'metadata.citation',
  label: 'Citation',
  placeholder: 'Citations loading',
};
