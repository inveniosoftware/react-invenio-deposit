// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FieldLabel, RemoteSelectField } from 'react-invenio-forms';

/**Affiliation input component */
export class AffiliationsField extends Component {
  serializeAffiliations = (affiliations) =>
    affiliations.map((affiliation) => ({
      text: affiliation.name,
      value: (affiliation.id || affiliation.name),
      key: (affiliation.id || affiliation.name),
    }));

  render() {
    const { fieldPath } = this.props;
    return (
      <>
        <RemoteSelectField
          fieldPath={fieldPath}
          suggestionAPIUrl="/api/affiliations"
          suggestionAPIHeaders={{
            Accept: 'application/json',
          }}
          serializeSuggestions={this.serializeAffiliations}
          placeholder="Search or create affiliation'"
          label={
            <FieldLabel htmlFor={`${fieldPath}.name`} label={'Name'} />
          }
          noQueryMessage="Search for affiliations.."
          allowAdditions
          clearable
          multiple
        />
      </>
    );
  }
}

AffiliationsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
};
