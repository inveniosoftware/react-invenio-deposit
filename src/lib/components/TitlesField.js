// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon } from 'semantic-ui-react';

import {
  ArrayField,
  FieldLabel,
  GroupField,
  SelectField,
  TextField,
} from 'react-invenio-forms';


export class TitlesField extends Component {
  render() {
    const {
      options,
    } = this.props;

    const defaultNewValue = {
      'lang': '',
      'title': '',
      'type': 'alternativetitle',
    };

    return (
      <>
        <TextField
          fieldPath={'metadata.title'}
          label={
            <FieldLabel htmlFor={'metadata.title'} icon={'book'} label={'Title'} />
          }
          required
        />
        <ArrayField
          addButtonLabel={'Add titles'}
          defaultNewValue={defaultNewValue}
          fieldPath={'metadata.additional_titles'}
        >
          {({ array, arrayHelpers, indexPath, key }) => (
            <GroupField widths="equal" fieldPath={'metadata.additional_titles'}>
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
              <Form.Field>
                <Form.Field>
                  <label>&nbsp;</label>
                  <Button icon>
                    <Icon
                      name="close"
                      size="large"
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

TitlesField.propTypes = {
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
