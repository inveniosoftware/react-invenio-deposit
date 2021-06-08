// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { FieldLabel, SelectField } from 'react-invenio-forms';

export class ResourceTypeField extends Component {
  groupErrors = (errors, fieldPath) => {
    const fieldErrors = _get(errors, fieldPath);
    if (fieldErrors) {
      return { content: fieldErrors };
    }
    return null;
  };

  /**
   * Generate label value
   *
   * @param {object} option - back-end option
   * @returns {string} label
   */
  _label = (option) => {
    return (
      option.type_name +
      (option.subtype_name ? ' / ' + option.subtype_name : '')
    );
  };

  /**
   * Convert back-end options to front-end options.
   *
   * @param {array} propsOptions - back-end options
   * @returns {array} front-end options
   */
  createOptions = (propsOptions) => {
    return propsOptions
      .map((o) => ({ ...o, label: this._label(o) }))
      .sort((o1, o2) => o1.label.localeCompare(o2.label))
      .map((o) => {
        return {
          text: (
            <>
              <i className={o.icon + ' icon'}></i>
              <span className="text">{o.label}</span>
            </>
          ),
          value: o.id,
        };
      });
  };

  render() {
    const { fieldPath, label, labelIcon, options, ...restProps } = this.props;
    const frontEndOptions = this.createOptions(options);
    return (
      <SelectField
        fieldPath={fieldPath}
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        optimized={true}
        options={frontEndOptions}
        {...restProps}
      />
    );
  }
}

ResourceTypeField.propTypes = {
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  labelClassName: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      type_name: PropTypes.string,
      subtype_name: PropTypes.string,
      id: PropTypes.string,
    })
  ).isRequired,
  required: PropTypes.bool,
};

ResourceTypeField.defaultProps = {
  fieldPath: 'metadata.resource_type',
  label: 'Resource type',
  labelIcon: 'tag',
  labelClassName: 'field-label-class',
};
