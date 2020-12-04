// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldLabel, RemoteSelectField } from 'react-invenio-forms';
import { Form } from 'semantic-ui-react';

//TODO: remove after backend will be implemented
const fetchedOptions = [
  { title: 'Deep Learning', id: 'dl', scheme: 'user' },
  { title: 'MeSH: Cognitive Neuroscience', id: 'cn',  scheme: 'mesh' },
  { title: 'FAST: Glucagonoma', id: 'gl', scheme: 'fast' },
];

export class SubjectsField extends Component {
  state = {
    limitTo: 'all',
  };

  render() {
    const {
      fieldPath,
      label,
      labelIcon,
      required,
      multiple,
      placeholder,
      clearable,
      limitToOptions,
    } = this.props;
    const { limitTo } = this.state;
    return (
      <>
        <RemoteSelectField
          allowAdditions
          fieldPath={fieldPath}
          suggestionAPIUrl="/api/vocabularies/subjects"
          suggestionAPIQueryParams={{ limit_to: limitTo }}
          placeholder={placeholder}
          required={required}
          clearable={clearable}
          multiple={multiple}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          noQueryMessage="Search for subjects.."
          fetchedOptions={fetchedOptions}
        />
        <Form.Dropdown
          inline
          selection
          onChange={(event, data) => this.setState({ limitTo: data.value })}
          options={limitToOptions}
          value={limitTo}
          label={'Limit To'}
        />
      </>
    );
  }
}

SubjectsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  clearable: PropTypes.bool,
  placeholder: PropTypes.string,
};

SubjectsField.defaultProps = {
  fieldPath: 'metadata.subjects',
  label: 'Subjects',
  labelIcon: 'tag',
  multiple: true,
  clearable: true,
  placeholder: 'Search or create subjects',
};
