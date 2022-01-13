// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import _get from 'lodash/get';
import _pick from 'lodash/pick';
import { ArrayField, FieldLabel, GroupField, SelectField } from 'react-invenio-forms';
import { Button, Form, Icon } from 'semantic-ui-react';
import { i18next } from '@translations/i18next';
import { emptyFunding } from '../record';


export class FundingField extends Component {
  groupErrors = (errors) => {
    for (const field in errors) {
      if (field.startsWith(this.props.fieldPath)) {
        return { content: _get(errors, this.props.fieldPath) };
      }
    }
    return null;
  };

  renderField = ({field, form}) => {
    const {
      fieldPath,
      label,
      labelIcon,
      options,
      required
    } = this.props;

    const selectFieldFunderOptions = (
      options.funder.map(
        (f) => Object({text: f.name, value: `${f.scheme} ${f.identifier}`})
      )
    );

    return (
      <ArrayField
        addButtonLabel={i18next.t('Add award')} // TODO: Pass by prop
        defaultNewValue={emptyFunding}
        fieldPath={fieldPath}
        label={label}
        labelIcon={labelIcon}
        required={required}
      >
        {({ arrayHelpers, indexPath, form }) => {
          const fieldPathPrefix = `${fieldPath}.${indexPath}`;

          return (
            <GroupField widths="equal" optimized>
              <SelectField
                error={this.groupErrors(form.errors)}
                fieldPath={`${fieldPathPrefix}.funder`}
                label={
                  <FieldLabel
                    htmlFor={`${fieldPathPrefix}.funder`}
                    label={i18next.t('Funding Organization')}
                  />
                }
                options={selectFieldFunderOptions}
                onChange={(event, selectedOption) => {
                  const funderFieldPath = `${fieldPathPrefix}.funder`;
                  const awardFieldPath = `${fieldPathPrefix}.award`;
                  const [scheme, identifier] = selectedOption.value.split(" ");
                  const funderValue = options.funder.find(
                    (f) => f.scheme === scheme && f.identifier === identifier
                  );
                  form.setFieldValue(funderFieldPath, funderValue);
                  form.setFieldValue(awardFieldPath, emptyFunding.award);
                }}
                value={(()=> {
                  const funder = _get(form.values, `${fieldPathPrefix}.funder`);
                  return funder ? `${funder.scheme} ${funder.identifier}` : '';
                })()}
                placeholder={i18next.t('Funding organization...')}
                required
                optimized
              />
              <SelectField
                error={this.groupErrors(form.errors)}
                fieldPath={`${fieldPathPrefix}.award`}
                label={
                  <FieldLabel
                    htmlFor={`${fieldPathPrefix}.award`}
                    label={i18next.t('Award')}
                  />
                }
                options={
                  options.award
                  .filter((a) => {
                    const funder = _get(form.values, `${fieldPathPrefix}.funder`);
                    return funder.scheme === a.parentScheme && funder.identifier === a.parentIdentifier
                  })
                  .map(
                    (a) => Object({text: a.title, value: `${a.scheme} ${a.identifier}`})
                  )
                }
                onChange={(event, selectedOption) => {
                  const awardFieldPath = `${fieldPathPrefix}.award`;
                  const [scheme, identifier] = selectedOption.value.split(" ");
                  let award = options.award.find(
                    (a) => a.scheme === scheme && a.identifier === identifier
                  );
                  // Get rid of parentScheme + parentIdentifier
                  award = _pick(award, ["identifier", "number", "scheme", "title"]);
                  form.setFieldValue(awardFieldPath, award);
                }}
                value={(()=> {
                  const award = _get(form.values, `${fieldPathPrefix}.award`);
                  return award ? `${award.scheme} ${award.identifier}` : '';
                })()}
                placeholder={i18next.t('Award number/acronym/name ...')}
                required
                optimized
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
          );
        }}
      </ArrayField>
    );
  };

  render() {
    return (
      <Field
        name={this.props.fieldPath}
        component={this.renderField}
      />
    );
  }
}

FundingField.propTypes = {
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  options: PropTypes.shape({
    funder: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        identifier: PropTypes.string,
        scheme: PropTypes.string,
      })
    ),
    award: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        number: PropTypes.string,
        identifier: PropTypes.string,
        scheme: PropTypes.string,
        parentScheme: PropTypes.string,
        parentIdentifier: PropTypes.string,
      })
    ),
  }).isRequired,
  required: PropTypes.bool,
};

FundingField.defaultProps = {
  fieldPath: 'metadata.funding',
  label: i18next.t('Awards'),
  labelIcon: 'money bill alternate outline',
};
