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
  constructor(props) {
      super(props);
      this.state = {
          affiliations: []
      }
  }
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
    return fromField;
  };

  componentDidMount() {
      this.setState({
          affiliations: this.props.options
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      console.log('Previous props AFF', prevProps.options)
      console.log('Current props AFF', this.props.options)
      if (prevProps.options !== this.props.options) {
          this.setState({
              affiliations: this.props.options
          })
      }
  }

  render() {
    console.log('INNER AFF props', this.props.options);
    console.log('INNER AFF state', this.state.affiliations);
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
              // So when I change L80 to the one below, it doesn't work, but the contents of props.options and state.affiliations are the same
              // initialSuggestions={this.state.affiliations}
              // Not sure if we can make this fully work without tinkering with the underlying RemoteSelectField
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
