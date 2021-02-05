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
    const {
      fieldPath,
      label,
      labelIcon,
      options,
      required,
      labelClassName,
      ...uiProps
    } = this.props;

    // 1- create the master list of options from
    const optionsList = this.createOptions(options);

    // 2- handlechange grabs the values of the selected option and sticks those
    //    in form.values
    const handleChange = ( event, data ) => {
      // NOTE: Clicking on "x" to clear sends data.value = "", so we need
      //       to account for this selection
      const option = data.options.find((e) => e.value === data.value);
      const fieldValue = option ? option.values : "";
      form.setFieldValue(fieldPath, fieldValue);
    }

    // 3- loads/displays the correct value from the dropdown
    //    If no initial value, value must be set to "" for placeholder to display.
    let value = this.loadValue(form.values, fieldPath);

    return (
      // NOTE: we are using a semantic-ui Form.Dropdown directly because
      //       - we need more control
      //       - this field is just for show - the formik logic is done behind
      //         the scenes
      <Form.Dropdown
        fluid
        selection
        error={this.groupErrors(form.errors, fieldPath)}
        id={fieldPath}
        label={
          <FieldLabel
            htmlFor={fieldPath}
            icon={labelIcon}
            label={label}
            className={labelClassName}
          />
        }
        name={fieldPath}
        onChange={handleChange}
        options={optionsList}
        placeholder={"Select resource type"}
        required={required}
        value={value}
        {...uiProps}
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
  labelClassName: PropTypes.string,
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
  labelClassName: 'field-label-class',
};
