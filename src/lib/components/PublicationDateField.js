// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FieldLabel, TextField } from 'react-invenio-forms';

export class PublicationDateField extends Component {
  render() {
    const { fieldPath } = this.props;

    return (
      <TextField
        fieldPath={fieldPath}
        label={
          <FieldLabel htmlFor={fieldPath} icon={'calendar'} label={'Publication Date'} />
        }
        placeholder={"YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD for intervals. MM and DD are optional."}
        required
      />
    );
  }
}

PublicationDateField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
};

PublicationDateField.defaultProps = {
  fieldPath: 'metadata.publication_date',
};
