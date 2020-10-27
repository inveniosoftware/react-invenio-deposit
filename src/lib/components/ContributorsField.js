// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react';
import { getIn } from 'formik';
import { ArrayField, SelectField, TextField } from 'react-invenio-forms';

import { IdentifiersField } from './IdentifiersField';
import { AffiliationsField } from './AffiliationsField';
import { emptyContributor } from '../record';

export class ContributorsField extends Component {
  /** Top-level Contributors Component */

  render() {
    const { fieldPath, options, label, labelIcon } = this.props;

    return (
      <ArrayField
        addButtonLabel={'Add contributor'} // TODO: Pass by prop
        defaultNewValue={emptyContributor}
        fieldPath={fieldPath}
        label={label}
        labelIcon={labelIcon}
      >
        {({ array, arrayHelpers, indexPath, key, form }) => (
          <>
            <TextField fieldPath={`${key}.name`} label={'Name'} required />
            <SelectField
              fieldPath={`${key}.role`}
              label={'Role'}
              options={options.role}
              placeholder="Select contributor role"
              required
            />
            <SelectField
              fieldPath={`${key}.type`}
              label={'Type'}
              options={options.type}
              placeholder="Select type of contributor"
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

ContributorsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string,
  options: PropTypes.shape({
    type: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }),
};

ContributorsField.defaultProps = {
  fieldPath: 'metadata.contributors',
};
