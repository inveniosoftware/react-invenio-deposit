// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon } from 'semantic-ui-react';

import {
  ArrayField,
  GroupField,
  SelectField,
  RichInputField,
} from 'react-invenio-forms';
import { emptyAdditionalDescription } from '../record';
import { LanguagesField } from './LanguagesField';

export class AdditionalDescriptionsField extends Component {
  render() {
    const { fieldPath, options } = this.props;

    return (
      <ArrayField
        addButtonLabel={'Add description'}
        defaultNewValue={emptyAdditionalDescription}
        fieldPath={fieldPath}
      >
        {({ array, arrayHelpers, indexPath, key }) => (
          <>
            <RichInputField
              fieldPath={`${key}.description`}
              label={'Additional Description'}
              optimized={true}
              required
            />
            <GroupField widths="equal" fieldPath={fieldPath}>
              <SelectField
                fieldPath={`${key}.type`}
                label={'Type'}
                options={options.type}
                required
              />
              <LanguagesField
                fieldPath={`${key}.lang`}
                label={'Language'}
                multiple={false}
                placeholder={'Select language'}
                labelIcon={null}
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
            </GroupField>
          </>
        )}
      </ArrayField>
    );
  }
}

AdditionalDescriptionsField.propTypes = {
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

AdditionalDescriptionsField.defaultProps = {
  fieldPath: 'metadata.additional_descriptions',
};
