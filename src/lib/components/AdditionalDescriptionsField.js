// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Icon } from 'semantic-ui-react';

import { ArrayField, SelectField, RichInputField } from 'react-invenio-forms';
import { emptyAdditionalDescription } from '../record';
import { LanguagesField } from './LanguagesField';
import { i18next } from '../i18next';

export class AdditionalDescriptionsField extends Component {
  render() {
    const { fieldPath, options, recordUI } = this.props;
    return (
      <ArrayField
        addButtonLabel={i18next.t('Add description')}
        defaultNewValue={emptyAdditionalDescription}
        fieldPath={fieldPath}
      >
        {({ array, arrayHelpers, indexPath, key }) => (
          <>
            <Grid relaxed>
              <Grid.Row>
                <Grid.Column width={12}>
                  <RichInputField
                    fieldPath={`${key}.description`}
                    label={i18next.t('Additional Description')}
                    optimized={true}
                    required
                  />
                </Grid.Column>
                <Grid.Column width={4}>
                  <Form.Field>
                    <Button
                      floated="right"
                      icon
                      onClick={() => arrayHelpers.remove(indexPath)}
                    >
                      <Icon name="close" />
                    </Button>
                  </Form.Field>
                  <SelectField
                    fieldPath={`${key}.type`}
                    label={i18next.t('Type')}
                    options={options.type}
                    required
                    optimized
                  />
                  <LanguagesField
                    serializeSuggestions={(suggestions) =>
                      suggestions.map((item) => ({
                        text: item.title_l10n,
                        value: item.id,
                        key: item.id,
                      }))
                    }
                    initialOptions={
                      recordUI?.additional_descriptions &&
                      recordUI.additional_descriptions[indexPath]?.lang
                        ? [recordUI.additional_descriptions[indexPath].lang]
                        : []
                    }
                    fieldPath={`${key}.lang`}
                    label={i18next.t('Language')}
                    multiple={false}
                    placeholder={i18next.t('Select language')}
                    labelIcon={null}
                    clearable
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
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
  recordUI: PropTypes.object,
};

AdditionalDescriptionsField.defaultProps = {
  fieldPath: 'metadata.additional_descriptions',
  recordUI: {},
};
