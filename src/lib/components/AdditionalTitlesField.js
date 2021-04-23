// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
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
  TextField,
} from 'react-invenio-forms';
import { emptyAdditionalTitle } from '../record';
import { LanguagesField } from './LanguagesField';

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
          <GroupField fieldPath={fieldPath}>
            <TextField
              fieldPath={`${key}.title`}
              label={'Additional title'}
              optimized
              width={5}
            />
            <SelectField
              fieldPath={`${key}.type`}
              label={'Type'}
              options={options.type}
              width={5}
            />
            <LanguagesField
              fieldPath={`${key}.lang`}
              // initialOptions={
              //   _get(this.props.record, "ui.languages", [])
              //   // needed because dumped empty record from backend gives [null]
              //   .filter((lang) => lang !== null)
              // }
              serializeSuggestions={(suggestions) =>
                suggestions.map((item) => ({
                  text: item.title_l10n,
                  value: item.id,
                  key: item.id,
                }))
              }
              label={'Language'}
              multiple={false}
              placeholder={'Select language'}
              labelIcon={null}
              clearable
              width={5}
            />
            <Form.Field width={1}>
              <label>&nbsp;</label>
              <Button icon onClick={() => arrayHelpers.remove(indexPath)}>
                <Icon name="close" />
              </Button>
            </Form.Field>
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
