// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2022 Northwestern University.
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
import { i18next } from '@translations/i18next';

export class AdditionalTitlesField extends Component {
  render() {
    const { fieldPath, options, recordUI } = this.props;
    return (
      <ArrayField
        addButtonLabel={i18next.t('Add titles')}
        defaultNewValue={emptyAdditionalTitle}
        fieldPath={fieldPath}
      >
        {({ arrayHelpers, indexPath }) => {
          const fieldPathPrefix = `${fieldPath}.${indexPath}`;

          return (
            <GroupField fieldPath={fieldPath} optimized>
              <TextField
                fieldPath={`${fieldPathPrefix}.title`}
                label={'Additional title'}
                required
                width={5}
              />
              <SelectField
                fieldPath={`${fieldPathPrefix}.type`}
                label={'Type'}
                optimized
                options={options.type}
                required
                width={5}
              />
              <LanguagesField
                serializeSuggestions={(suggestions) =>
                  suggestions.map((item) => ({
                    text: item.title_l10n,
                    value: item.id,
                    fieldPathPrefix: item.id,
                  }))
                }
                initialOptions={
                  recordUI?.additional_titles &&
                  recordUI.additional_titles[indexPath]?.lang
                    ? [recordUI.additional_titles[indexPath].lang]
                    : []
                }
                fieldPath={`${fieldPathPrefix}.lang`}
                label={'Language'}
                multiple={false}
                placeholder={'Select language'}
                labelIcon={null}
                clearable
                selectOnBlur={false}
                width={5}
              />
              <Form.Field width={1} className="align-self-end">
                <Button icon
                        onClick={() => arrayHelpers.remove(indexPath)}>
                  <Icon name="close" />
                </Button>
              </Form.Field>
            </GroupField>
          );
        }}
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
  recordUI: PropTypes.object,
};

AdditionalTitlesField.defaultProps = {
  fieldPath: 'metadata.additional_titles',
};
