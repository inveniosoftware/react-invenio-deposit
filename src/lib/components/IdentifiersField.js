// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  TextField,
  GroupField,
  ArrayField,
  FieldLabel,
} from 'react-invenio-forms';
import { Button, Form, Icon } from 'semantic-ui-react';
import { SelectField } from 'react-invenio-forms';
import { emptyIdentifier } from '../record';

/** Identifiers array component */
export class IdentifiersField extends Component {
  render() {
    const { fieldPath, label, labelIcon, required, schemeOptions } = this.props;
    return (
      <>
        <ArrayField
          addButtonLabel={'Add identifier'}
          defaultNewValue={emptyIdentifier}
          fieldPath={fieldPath}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          required={required}
        >
          {({ array, arrayHelpers, indexPath, key }) => (
            <GroupField widths="equal">
              {schemeOptions &&
                <SelectField
                  fieldPath={`${key}.scheme`}
                  label={'Scheme'}
                  options={schemeOptions}
                />
              }
              {!schemeOptions &&
                <TextField fieldPath={`${key}.scheme`} label={'Scheme'} />
              }
              <TextField fieldPath={`${key}.identifier`} label={'Identifier'} />
              <Form.Field>
                <Form.Field>
                  <label>&nbsp;</label>
                  <Button icon
                    onClick={() => arrayHelpers.remove(indexPath)}
                  >
                    <Icon
                      name="close"
                      size="large"
                      type="button"
                    />
                  </Button>
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
  )
};

IdentifiersField.defaultProps = {
  fieldPath: 'metadata.identifiers',
  label: 'Identifier(s)',
  labelIcon: 'barcode',
};
