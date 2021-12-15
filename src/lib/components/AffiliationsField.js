// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FieldLabel, RemoteSelectField } from 'react-invenio-forms';
import { Field, getIn } from 'formik';
import { i18next } from '@translations/i18next';

/**Affiliation input component */
export class AffiliationsField extends Component {
  serializeAffiliations = (affiliations) =>
    affiliations.map((affiliation) => ({
      text: affiliation.acronym
        ? `${affiliation.name} (${affiliation.acronym})`
        : affiliation.name,
      value: affiliation.name,
      key: affiliation.name,
      ...(affiliation.id ? { id: affiliation.id } : {}),
      name: affiliation.name,
    }));

  handleOnValueChange = ({ formikProps }, selectedSuggestions) => {
    this.props.onValueChange(
      selectedSuggestions,
      formikProps,
      this.props.fieldPath
    );
  };

  handleValue = (values) => {
    console.log('values', values);
    const fromField = getIn(values, this.props.fieldPath, []).map(
      (val) => val.name
    );
    console.log('field', fromField); // YOU CAN SEE THE VALUES ARE THERE
    return fromField.concat(fromField);
  };

  render() {
    console.log('INNER AFF', this.props.options);
    return (
      <Field name={this.props.fieldPath}>
        {({ form: { values } }) => {
          return (
            <RemoteSelectField
              fieldPath={this.props.fieldPath}
              suggestionAPIUrl="/api/affiliations"
              suggestionAPIHeaders={{
                Accept: 'application/json',
              }}
              initialSuggestions={this.props.options}
              serializeSuggestions={this.serializeAffiliations}
              placeholder={i18next.t("Search or create affiliation'")}
              label={
                <FieldLabel
                  htmlFor={`${this.props.fieldPath}.name`}
                  label={i18next.t('Affiliations')}
                />
              }
              noQueryMessage={i18next.t('Search for affiliations..')}
              allowAdditions
              clearable
              multiple
              onValueChange={this.handleOnValueChange}
              value={this.handleValue(values)}
            />
          );
        }}
      </Field>
    );
  }
}

AffiliationsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  onValueChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
};
