// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldLabel, GroupField, RemoteSelectField } from 'react-invenio-forms';
import { Form } from 'semantic-ui-react';
import _get from 'lodash/get';


export class SubjectsField extends Component {
  state = {
    limitTo: 'all',
  };

  serializeSubjects = (subjects) => {
    return subjects.map((subject) => ({
      text: subject.title_l10n,
      value: _get(subject, 'id', subject.id),
      key: _get(subject, 'id', subject.id),
    }));
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
      initialOptions,
    } = this.props;
    const { limitTo } = this.state;
    return (
      <GroupField>
        <RemoteSelectField
          initialSuggestions={initialOptions}
          fieldPath={fieldPath}
          suggestionAPIUrl="/api/vocabularies/subjects"
          suggestionAPIQueryParams={{ limit_to: limitTo }}
          suggestionAPIHeaders={{
            Accept: 'application/vnd.inveniordm.v1+json',
          }}
          serializeSuggestions={this.serializeSubjects}
          placeholder={placeholder}
          required={required}
          clearable={clearable}
          multiple={multiple}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          noQueryMessage="Search for subjects.."
          width={11}
        />
        <Form.Dropdown
          selection
          onChange={(event, data) => this.setState({ limitTo: data.value })}
          options={limitToOptions}
          value={limitTo}
          label={'Limit To'}
          width={5}
        />
      </GroupField>
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
  initialOptions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      text: PropTypes.string,
    })
  ),
};

SubjectsField.defaultProps = {
  fieldPath: 'metadata.subjects',
  label: 'Subjects',
  labelIcon: 'tag',
  multiple: true,
  clearable: true,
  placeholder: 'Search for a subject by name',
};
