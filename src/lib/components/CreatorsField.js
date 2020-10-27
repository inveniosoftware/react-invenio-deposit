// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react';
import { ArrayField, SelectField, TextField } from 'react-invenio-forms';

import { emptyCreator } from '../record';

import { IdentifiersField } from './IdentifiersField';
import { AffiliationsField } from './AffiliationsField';

export class CreatorsField extends Component {
  /** Top-level Creators Component */

  render() {
    const { fieldPath, options, label, labelIcon } = this.props;

    return (
      <ArrayField
        addButtonLabel={'Add creator'} // TODO: Pass by prop
        defaultNewValue={emptyCreator}
        fieldPath={fieldPath}
        label={label}
        labelIcon={labelIcon}
        required
      >
        {({ array, arrayHelpers, indexPath, key, form }) => (
          <>
            <TextField fieldPath={`${key}.name`} label={'Name'} required />
            <SelectField
              fieldPath={`${key}.type`}
              label={'Type'}
              options={options.type}
              placeholder="Select type of creator"
            />
            <TextField fieldPath={`${key}.family_name`} label={'Family Name'} />
            <TextField fieldPath={`${key}.given_name`} label={'Given Name'} />

            <IdentifiersField fieldPath={`${key}.identifiers`} />
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
        )}
      </ArrayField>
    );
  }
}

CreatorsField.propTypes = {
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string,
  options: PropTypes.shape({
    // NOTE: It is fine for the interface to ask for 'type', because it doesn't
    //       presuppose the knowledge of the data model. It simply defines
    //       what it expects.
    //       Other requirement: one of these options must have value "Personal"
    //       Alternative is to pass the "person-equivalent" option as a prop
    type: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }),
};

CreatorsField.defaultProps = {
  fieldPath: 'metadata.creators',
};
