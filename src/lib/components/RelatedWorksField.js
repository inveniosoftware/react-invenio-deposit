// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
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

import { emptyRelatedWork } from '../record';
import { ResourceTypeField } from './ResourceTypeField';

export class RelatedWorksField extends Component {
  render() {
    const { fieldPath, label, labelIcon, required, options } = this.props;

    return (
      <>
        <ArrayField
          addButtonLabel={'Add related work'}
          defaultNewValue={emptyRelatedWork}
          fieldPath={fieldPath}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          required={required}
        >
          {({ array, arrayHelpers, indexPath, key }) => (
            <GroupField>
              <SelectField
                clearable
                fieldPath={`${key}.relation_type`}
                label="Relation"
                options={options.relations}
                placeholder={'Select relation...'}
                width={3}
              />
              <SelectField
                clearable
                fieldPath={`${key}.scheme`}
                label="Scheme"
                options={options.scheme}
                width={2}
              />
              <TextField
                fieldPath={`${key}.identifier`}
                label="Identifier"
                width={4}
              />

            <ResourceTypeField
              clearable
              fieldPath={`${key}.resource_type`}
              labelIcon={''}  // Otherwise breaks alignment
              options={options.resource_type}
              width={6}
              labelClassName="small field-label-class"
            />

            <Form.Field width={1}>
              <label>&nbsp;</label>
              <Button
                icon
                onClick={() => arrayHelpers.remove(indexPath)}
                >
                <Icon name="close" />
              </Button>
            </Form.Field>
          </GroupField>
          )}
        </ArrayField>
      </>
    );
  }
}

RelatedWorksField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
};

RelatedWorksField.defaultProps = {
  fieldPath: 'metadata.related_identifiers',
  label: 'Related work',
  labelIcon: 'barcode',
};
