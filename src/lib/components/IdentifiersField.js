// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextField, GroupField, ArrayField } from 'react-invenio-forms';
import { Button, Form, Icon } from 'semantic-ui-react';

import { emptyIdentifier } from '../record';

/** Identifiers array component */
export class IdentifiersField extends Component {
  render() {
    const { fieldPath } = this.props;

    return (
      <>
        <ArrayField
          addButtonLabel={'Add identifier'}
          defaultNewValue={emptyIdentifier}
          fieldPath={fieldPath}
          label={'Identifier(s)'}
        >
          {({ array, arrayHelpers, indexPath, key }) => (
            <GroupField widths="equal">
              <TextField fieldPath={`${key}.scheme`} label="Scheme" />
              <TextField fieldPath={`${key}.identifier`} label="Identifier" />
              <Form.Field>
                <Form.Field>
                  <label>&nbsp;</label>
                  <Button icon>
                    <Icon
                      name="close"
                      size="large"
                      type="button"
                      onClick={() => arrayHelpers.remove(indexPath)}
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
};
