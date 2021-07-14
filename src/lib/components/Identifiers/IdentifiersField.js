// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ArrayField,
  FieldLabel,
  GroupField,
  SelectField,
  TextField,
} from 'react-invenio-forms';
import { Button, Form } from 'semantic-ui-react';
import { i18next } from '../../i18next';
import { emptyIdentifier } from '../../record';

/** Identifiers array component */
export class IdentifiersField extends Component {
  render() {
    const { fieldPath, label, labelIcon, required, schemeOptions } = this.props;
    return (
      <>
        <ArrayField
          addButtonLabel={i18next.t('Add identifier')}
          defaultNewValue={emptyIdentifier}
          fieldPath={fieldPath}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          required={required}
        >
          {({ array, arrayHelpers, indexPath, key }) => (
            <GroupField optimized>
              <TextField
                fieldPath={`${key}.identifier`}
                label={i18next.t('Identifier')}
                width={11}
              />
              {schemeOptions && (
                <SelectField
                  fieldPath={`${key}.scheme`}
                  label={i18next.t('Scheme')}
                  options={schemeOptions}
                  optimized
                  width={5}
                />
              )}
              {!schemeOptions && (
                <TextField
                  fieldPath={`${key}.scheme`}
                  label={i18next.t('Scheme')}
                  width={5}
                />
              )}
              <Form.Field>
                <Form.Field>
                  <label>&nbsp;</label>
                  <Button
                    icon="close"
                    onClick={() => arrayHelpers.remove(indexPath)}
                  />
                </Form.Field>
              </Form.Field>
            </GroupField>
          )}
        </ArrayField>
      </>
    );
  }
}

IdentifiersField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
  schemeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};

IdentifiersField.defaultProps = {
  fieldPath: 'metadata.identifiers',
  label: i18next.t('Identifier(s)'),
  labelIcon: 'barcode',
};
