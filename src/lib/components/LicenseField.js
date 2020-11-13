// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2020 Cottage Labs LLP.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component, useMemo } from 'react';
import PropTypes from 'prop-types';

import { FieldLabel, GroupField, SelectField, TextField } from 'react-invenio-forms';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export function LicenseField({ vocabulary, fieldPath }) {
  let itemKey = ({ scheme, identifier }) => `${scheme}:${identifier}`;

  let vocabularyByValue = {};
  vocabulary.forEach(item => {
    vocabularyByValue[itemKey(item)] = item;
  });

  let options = vocabulary.map(item => ({
    text: item.rights,
    value: itemKey(item),
  }));

  function renderLicenseField({field: {label, handleBlur, ...uiProps }, form: {values, errors}  }) {
    let value = getIn(values, fieldPath, []);
    let error = getIn(errors, fieldPath, []);
    value = value.length > 0 ? itemKey(value[0]) : null;
    error = error.length > 0 ? errors[0] : null;

    return <Form.Dropdown
      fluid
      search
      selection
      error={error}
      id={fieldPath}
      label={<FieldLabel
        htmlFor={fieldPath}
        icon={"certificate"}
        label={"License"}
      />}
      name={fieldPath}
      onBlur={handleBlur}
      onChange={(event, data) => {
        setFieldValue(fieldPath, [vocabularyByValue[data.value]]);
      }}
      options={options}
      value={value}
      {...uiProps}
    />
  }

  return <Field name={fieldPath} component={renderLicenseField}/>;
}