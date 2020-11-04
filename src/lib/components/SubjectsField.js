// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { Field } from 'formik';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FieldLabel, SelectField } from 'react-invenio-forms';
import { Form } from 'semantic-ui-react';


export class SubjectsField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limitTo: 'all',
    };
  }

  renderField = ({field, form}) => {
    const {
      fieldPath,
      label,
      labelIcon,
      limitToOptions,
      options,
      required
    } = this.props;
    const limitTo = this.state.limitTo;

    // NOTE: We need to convert from Formik form values to SelectField values.
    //       Think of it as Formik holding the real data and SelectField just
    //       being a view.
    // Here we convert complex objects to {text, value}
    const selectfieldOptions = (
      options
      .filter((o) => limitTo === 'all' || o.value.scheme === limitTo)
      .map((o) => Object({text: o.text, value: o.value.identifier}))
    );
    // NOTE: Initially field.value is undefined
    const fieldValue = field.value || [];
    // Here we convert complex objects to identifiers (strings)
    const selectfieldValue = fieldValue.map((o) => o.identifier);

    return (
      <>
        <SelectField
          fieldPath={fieldPath}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          multiple
          onChange={(event, data) => {
            // NOTE: Convert from identifiers to complex objects
            const values = data.value.map(
              (i) => options.find((o) => o.value.identifier === i).value
            );
            form.setFieldValue(fieldPath, values);
          }}
          options={selectfieldOptions}
          placeholder={'Select keywords...'}
          required={required}
          search
          value={selectfieldValue}
        />

        <Form.Dropdown
          fluid
          selection
          label={'Limit to'}
          onChange={(event, data) => {
            this.setState({limitTo: data.value});
          }}
          options={limitToOptions}
          value={limitTo}
          width={3}
        />
      </>
    );
  }

  render() {
    return (
      <Field
        name={this.props.fieldPath}
        component={this.renderField}
      />
    );
  }

}

SubjectsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.shape({
        subject: PropTypes.string,
        scheme: PropTypes.string,
        identifier: PropTypes.string,
      }),
    })
  ).isRequired,
  limitToOptions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  required: PropTypes.bool,
};

SubjectsField.defaultProps = {
  fieldPath: 'metadata.subjects',
  label: 'Keywords',
  labelIcon: 'tag',
};
