// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020-2021 Northwestern University.
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

  prepareSuggest = (searchQuery) => {
    const limitTo = this.state.limitTo;
    const prefix = limitTo === 'all' ? '' : `${limitTo}:`;
    return `${prefix}${searchQuery}`;
  }

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
    return (
      <GroupField>
        <Form.Field width={5}>
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          <GroupField>
            <Form.Field width={7} style={{marginBottom: "auto", marginTop: "auto"}}>
              Suggest from
            </Form.Field>
            <Form.Dropdown
              defaultValue={limitToOptions[0].value}
              fluid
              onChange={(event, data) => this.setState({ limitTo: data.value })}
              options={limitToOptions}
              selection
              width={8}
            />
          </GroupField>
        </Form.Field>

        <RemoteSelectField
          clearable={clearable}
          fieldPath={fieldPath}
          initialSuggestions={initialOptions}
          label={<label>&nbsp;</label>}  /** For alignmnent purposes */
          multiple={multiple}
          noQueryMessage="Search for subjects.."
          placeholder={placeholder}
          preSearchChange={this.prepareSuggest}
          required={required}
          serializeSuggestions={this.serializeSubjects}
          suggestionAPIUrl="/api/vocabularies/subjects"
          suggestionAPIHeaders={{
            Accept: 'application/vnd.inveniordm.v1+json',
          }}
          width={11}
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
