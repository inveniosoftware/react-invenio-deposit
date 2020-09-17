// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SelectField, TextField } from 'react-invenio-forms';


/**Identifier input component */
export class IdentifierField extends Component {
  render() {
    const { identifierFieldPath, schemeFieldPath, schemeOptions } = this.props;

    return (
      <>
        <SelectField
          fieldPath={schemeFieldPath}
          label={'Scheme'}
          options={schemeOptions}
        />
        <TextField fieldPath={identifierFieldPath} label="Identifier" />
      </>
    );
  }
}

IdentifierField.propTypes = {
  identifierFieldPath: PropTypes.string.isRequired,
  schemeFieldPath: PropTypes.string.isRequired,
  schemeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      text: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  // TODO: Pass labels as props
};

IdentifierField.defaultProps = {};
