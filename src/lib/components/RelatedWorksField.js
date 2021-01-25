// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
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
            <>
              <GroupField widths={"equal"} >
                <SelectField
                  fieldPath={`${key}.relation_type`}
                  options={options.relations}
                  placeholder={'Select relation...'}
                  label="Relation"
                  clearable
                />
                <SelectField
                  fieldPath={`${key}.scheme`}
                  options={options.scheme}
                  label="Scheme"
                  clearable
                />
                <TextField
                  fieldPath={`${key}.identifier`}
                  label="Identifier"
                />
              </GroupField>

              {/* TODO: Render as single SelectField and place inline */}
              <ResourceTypeField
                fieldPath={`${key}.resource_type`}
                options={options.resource_type}
                clearable
              />

              <Form.Field>
                <label>&nbsp;</label>
                <Button
                  icon
                  onClick={() => arrayHelpers.remove(indexPath)}
                >
                  <Icon name="close" size="large" />
                </Button>
              </Form.Field>
            </>
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
