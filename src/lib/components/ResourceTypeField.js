// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField } from 'formik';
import _get from 'lodash/get';
import { Form } from 'semantic-ui-react';

import { FieldLabel } from 'react-invenio-forms';

export class ResourceTypeField extends Component {
  groupErrors = (errors, fieldPath) => {
    const fieldErrors = _get(errors, fieldPath);
    if (fieldErrors) {
      return { content: fieldErrors };
    }
    return null;
  };

  createOptions = (propsOptions) => {
    let options = [];
    for (const type of propsOptions.type) {
      const subtypes = propsOptions.subtype.filter(
        (e) => e['parent-value'] === type.value
      );

      if (subtypes.length > 0) {
        // Push options corresponding to each subtype
        options.push(
          ...subtypes.map((subtype) => ({
            // NOTE: In this version of semantic-ui-react (0.88.2),
            // using icon key doesn't show icon in selected text. This does:
            text: <><i className={type.icon + " icon"}></i><span className="text">{subtype["parent-text"] + " / " + subtype.text}</span></>,
            value: subtype["parent-value"] + "/" + subtype.value,
            values: {type: type.value, subtype: subtype.value}
          }))
        );
      } else {
        // Push an option corresponding to the type only
        options.push({
            icon: type.icon,
            text: type.text,
            value: type.value,
            values: {type: type.value}
        })
      }
    }
    return options;
  }

  loadValue(values, fieldPath) {
    const resourceType = _get(values, fieldPath);
    let value;
    if (resourceType && resourceType.type) {
      value = resourceType.type + (resourceType.subtype ? "/" + resourceType.subtype : "");
    } else {
      value = "";
    }
    return value;
  }

  renderResourceTypeField = ({ field, form }) => {
    // 1- create the master list of options
    const options = this.createOptions(this.props.options);

    // 2- handlechange grabs the values of the selected option and sticks those
    //    in form.values
    const handleChange = ( event, data ) => {
      const option = data.options.find((e) => e.value === data.value);
      form.setFieldValue(this.props.fieldPath, option.values);
    }

    // 3- loads/displays the correct value from the dropdown
    //    If no initial value, value must be set to "" for placeholder to display.
    let value = this.loadValue(form.values, this.props.fieldPath);

    return (
      // NOTE: we are using a semantic-ui Form.Dropdown directly because
      //       - we need more control
      //       - this field is just for show - the formik logic is done behind
      //         the scenes
      <Form.Dropdown
        fluid
        selection
        error={this.groupErrors(form.errors, this.props.fieldPath)}
        id={this.props.fieldPath}
        label={
          <FieldLabel
            htmlFor={this.props.fieldPath}
            icon={this.props.labelIcon}
            label={this.props.label}
          />
        }
        name={this.props.fieldPath}
        onChange={handleChange}
        options={options}
        placeholder={"Select resource type"}
        required={this.props.required}
        value={value}
      />
    );
  };

  render() {
    return (
      <FastField
        name={this.props.fieldPath}
        component={this.renderResourceTypeField}
      />
    );
  }
}

ResourceTypeField.propTypes = {
  fieldPath: PropTypes.string,
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
  required: PropTypes.bool,
};

ResourceTypeField.defaultProps = {
  fieldPath: 'metadata.resource_type',
  label: 'Resource type',
  labelIcon: 'tag',
};
