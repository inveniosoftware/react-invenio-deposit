// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

import {
  ArrayField,
  GroupField,
  SelectField,
  TextField,
} from 'react-invenio-forms';
import { emptyAdditionalTitle } from '../record';

export class AdditionalTitlesField extends Component {
  render() {
    const { fieldPath, options } = this.props;

    return (
      <ArrayField
        addButtonLabel={'Add titles'}
        defaultNewValue={emptyAdditionalTitle}
        fieldPath={fieldPath}
      >
        {({ array, arrayHelpers, indexPath, key }) => (
          <GroupField widths="equal" fieldPath={fieldPath}>
            <TextField
              fieldPath={`${key}.title`}
              label={'Additional Title'}
              required
            />
            <SelectField
              fieldPath={`${key}.type`}
              label={'Type'}
              options={options.type}
            />
            <SelectField
              fieldPath={`${key}.lang`}
              label={'Language'}
              options={options.lang}
              clearable
            />
            <>
              <Button icon type="button">
                <Icon
                  name="close"
                  onClick={() => arrayHelpers.remove(indexPath)}
                />
              </Button>
            </>
          </GroupField>
        )}
      </ArrayField>
    );
  }
}

AdditionalTitlesField.propTypes = {
  options: PropTypes.shape({
    type: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    lang: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }),
};

AdditionalTitlesField.defaultProps = {
  fieldPath: 'metadata.additional_titles',
};
