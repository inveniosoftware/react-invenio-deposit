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
  SelectField,
} from 'react-invenio-forms';
import { Button, Form, Icon } from 'semantic-ui-react';

import { emptyIdentifier } from '../record';
import { ResourceTypeField } from './ResourceTypeField';

/** Identifiers array component */
export class RelatedIdentifiersField extends Component {
  render() {
    const { fieldPath, label, labelIcon, required, options } = this.props;

    return (
      <>
        <ArrayField
          addButtonLabel={'Add related identifier'}
          defaultNewValue={emptyIdentifier}
          fieldPath={fieldPath}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          required={required}
        >
          {({ array, arrayHelpers, indexPath, key }) => (
            <>
              <Form.Field>
                <GroupField widths="2">
                  <SelectField
                    fieldPath={`${key}.scheme`}
                    options={options.scheme}
                    label="Scheme"
                  />
                  <TextField
                    fieldPath={`${key}.identifier`}
                    label="Identifier"
                  />
                </GroupField>
              </Form.Field>
              <Form.Field>
                <GroupField widths="2">
                  <SelectField
                    fieldPath={`${key}.relation_type`}
                    options={options.relations}
                    placeholder={'Select relation...'}
                    label="Relation"
                  />
                  <ResourceTypeField
                    fieldPath={`${key}.resource_type`}
                    options={options.resource_type}
                  />
                </GroupField>
              </Form.Field>

              <Form.Field>
                <label>&nbsp;</label>
                <Button icon type="button">
                  <Icon
                    name="close"
                    size="large"
                    type="button"
                    onClick={() => arrayHelpers.remove(indexPath)}
                  />
                </Button>
              </Form.Field>
            </>
          )}
        </ArrayField>
      </>
    );
  }
}

RelatedIdentifiersField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
};

RelatedIdentifiersField.defaultProps = {
  fieldPath: 'metadata.related_identifiers',
  label: 'Related work',
  labelIcon: 'barcode',
};
