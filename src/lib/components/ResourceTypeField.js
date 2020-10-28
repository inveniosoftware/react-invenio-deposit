// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import _get from 'lodash/get';

import { FieldLabel, GroupField, SelectField } from 'react-invenio-forms';

export class ResourceTypeField extends Component {
  groupErrors = (errors) => {
    for (const field in errors) {
      if (field.startsWith(this.props.fieldPath)) {
        return { content: _get(errors, this.props.fieldPath) };
      }
    }
    return null;
  };

  renderResourceTypeField = (formikBag) => {
    const typeFieldPath = `${this.props.fieldPath}.type`;
    const subtypeFieldPath = `${this.props.fieldPath}.subtype`;

    const resource_type = _get(formikBag.form.values, typeFieldPath, '');

    const handleChange = (event, selectedOption) => {
      formikBag.form.setFieldValue(typeFieldPath, selectedOption.value);
      formikBag.form.setFieldValue(subtypeFieldPath, '');
    };

    const subtypeOptions = this.props.options.subtype.filter(
      (e) => e['parent-value'] === resource_type
    );

    return (
      <GroupField widths="equal">
        <SelectField
          error={this.groupErrors(formikBag.form.errors)}
          fieldPath={typeFieldPath}
          label={
            <FieldLabel
              htmlFor={typeFieldPath}
              icon={this.props.labelIcon}
              label={this.props.label}
            />
          }
          options={this.props.options.type}
          onChange={handleChange}
          placeholder="Select general resource type"
          required
        />
        {subtypeOptions.length > 0 && (
          <SelectField
            fieldPath={subtypeFieldPath}
            label={
              <FieldLabel
                htmlFor={subtypeFieldPath}
                icon={this.props.labelIcon}
                label={this.props.subtypeLabel}
              />
            }
            options={subtypeOptions}
            placeholder="Select resource subtype"
            required
          />
        )}
      </GroupField>
    );
  };

  render() {
    return (
      <Field
        name={this.props.fieldPath}
        component={this.renderResourceTypeField}
      />
    );
  }
}

ResourceTypeField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  options: PropTypes.shape({
    type: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    subtype: PropTypes.arrayOf(
      PropTypes.shape({
        'parent-text': PropTypes.string,
        'parent-value': PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }).isRequired,
  subtypeLabel: PropTypes.string,
};

ResourceTypeField.defaultProps = {
  label: 'Resource type',
  subtypeLabel: 'Resource Subtype',
  fieldPath: 'metadata.resource_type',
};
