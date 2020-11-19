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
  ArrayField,
  FieldLabel,
} from 'react-invenio-forms';
import { Button, Form, Icon } from 'semantic-ui-react';
import { IdentifiersField } from './IdentifiersField';

/**Affiliation input component */
export class AffiliationsField extends Component {
  render() {
    const { fieldPath } = this.props;

    return (
      <>
        <ArrayField
          addButtonLabel={'Add affiliation'}
          defaultNewValue={{}}
          fieldPath={fieldPath}
          label={'Affiliations'}
        >
          {({ array, arrayHelpers, indexPath, key }) => (
            <>
              <TextField
                fieldPath={`${key}.name`}
                label={
                  <FieldLabel htmlFor={`${fieldPath}.name`} label={'Name'} />
                }
                required
              />
              <IdentifiersField fieldPath={`${key}.identifiers`} labelIcon="" />
              {array.length === 1 ? null : (
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
              )}
            </>
          )}
        </ArrayField>
      </>
    );
  }
}

AffiliationsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
};
