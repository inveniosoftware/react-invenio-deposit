// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import {
  ErrorLabel,
  FieldLabel,
  RadioField,
  GroupField,
} from 'react-invenio-forms';
import { Card, Form } from 'semantic-ui-react';
import { Field } from 'formik';

export class AccessRightField extends Component {
  /** Top-level Access Right Component */

  render() {
    const { fieldPath, label, labelIcon, options } = this.props;

    return (
      <Card className="access-right">
        <Card.Content>
          <GroupField fieldPath={fieldPath} grouped>
            <Form.Field required>
              <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
              {options.map((option) => (
                <Field key={option.value}>
                  {({ field }) => {
                    return (
                      <RadioField
                        fieldPath={fieldPath}
                        label={option.text}
                        labelIcon={option.icon}
                        key={option.value}
                        value={option.value}
                        checked={_get(field.value, fieldPath) === option.value}
                      />
                    );
                  }}
                </Field>
              ))}
              <ErrorLabel fieldPath={fieldPath} />
            </Form.Field>
          </GroupField>
        </Card.Content>
      </Card>
    );
  }
}

AccessRightField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string,
  options: PropTypes.array,
};

AccessRightField.defaultProps = {
  fieldPath: 'access.access_right',
};
