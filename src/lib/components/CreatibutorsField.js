// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react';
import { ArrayField, GroupField, SelectField, TextField } from 'react-invenio-forms';

import { IdentifiersField } from './IdentifiersField';
import { AffiliationsField } from './AffiliationsField';
import { emptyCreatibutor } from '../record';

export class CreatibutorsField extends Component {
  /** Top-level Creators or Contributors Component */

  render() {
    const { addButtonLabel, fieldPath, options, label, labelIcon, required, roleRequired } = this.props;

    return (
      <ArrayField
        addButtonLabel={addButtonLabel}
        defaultNewValue={emptyCreatibutor}
        fieldPath={fieldPath}
        label={label}
        labelIcon={labelIcon}
        required={required}
      >
        {({ array, arrayHelpers, indexPath, key, form }) => {
          const typeFieldPath = `${key}.type`;
          const isOrganization = _get(form.values, typeFieldPath) === 'organizational';
          const isPerson = _get(form.values, typeFieldPath) === 'personal';

          return (
            <>
              <GroupField widths="equal" fieldPath={fieldPath + "Group"}>
                <SelectField
                  fieldPath={typeFieldPath}
                  label={'Type'}
                  options={options.type}
                  placeholder="Select type"
                  required
                />
                {
                  isOrganization &&
                  <TextField fieldPath={`${key}.name`} label={'Name'} required />
                }
                {
                  isPerson &&
                  <>
                    <TextField fieldPath={`${key}.family_name`} label={'Family Name'} />
                    <TextField fieldPath={`${key}.given_name`} label={'Given Name'} />
                  </>
                }
                <SelectField
                  fieldPath={`${key}.role`}
                  label={'Role'}
                  options={options.role}
                  placeholder="Select role"
                  required={roleRequired}
                  clearable
                />
              </GroupField>
              <IdentifiersField fieldPath={`${key}.identifiers`} labelIcon="" />
              <AffiliationsField fieldPath={`${key}.affiliations`} />
              <Grid>
                <Grid.Column></Grid.Column>
                <Grid.Column floated="right">
                  {array.length === 1 ? null : (
                    <Button
                      color="red"
                      floated="right"
                      onClick={() => arrayHelpers.remove(indexPath)}
                    >
                      Remove
                    </Button>
                  )}
                </Grid.Column>
              </Grid>
            </>
          );
        }}
      </ArrayField>
    );
  }
}

CreatibutorsField.propTypes = {
  addButtonLabel: PropTypes.string,
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  options: PropTypes.shape({
    type: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }).isRequired,
  roleRequired: PropTypes.bool
};

CreatibutorsField.defaultProps = {
  addButtonLabel: 'Add creator',
  fieldPath: 'metadata.creators',
  label: 'Creators',
  labelIcon: 'group',
  roleRequired: false
};
