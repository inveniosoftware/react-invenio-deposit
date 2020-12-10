// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ArrayField, FieldLabel } from 'react-invenio-forms';
import { Button, Form, Icon } from 'semantic-ui-react';
import { IdentifiersField } from './IdentifiersField';
import { RemoteSelectField } from 'react-invenio-forms';
import _get from 'lodash/get';

//TODO: remove after backend will be implemented
const fetchedOptions = [
  { title: 'CERN', id: 'cern', scheme: 'cern' },
  { title: 'Fermilab', id: 'fermilab', scheme: 'fermilab' },
  { title: 'Northwestern University', id: 'nu', scheme: 'nu' },
];

//TODO: remove after backend will be implemented
const affiliationSchemes = [
  { text: 'ISNI', value: 'isni' },
  { text: 'ROR', value: 'ror' },
];

/**Affiliation input component */
export class AffiliationsField extends Component {
  serializeAffiliations = (affiliations) =>
    affiliations.map((affiliation) => ({
      text: _get(affiliation, 'title', affiliation.name),
      value: affiliation.id || _get(affiliation, 'title', affiliation.name),
      key: affiliation.id || _get(affiliation, 'title', affiliation.name),
    }));

  render() {
    const { fieldPath } = this.props; //TODO: take affiliationSchemes from props
    return (
      <>
        <ArrayField
          addButtonLabel={'Add affiliation'}
          defaultNewValue={{}}
          fieldPath={fieldPath}
          label={'Affiliations'}
        >
          {({ array, arrayHelpers, indexPath, key, form: { values } }) => {
            // Get the full affiliation object that includes also the id of
            // the selected value
            const initialAffiliations = _get(values, key, {});
            return (
              <>
                <RemoteSelectField
                  required
                  selection
                  allowAdditions
                  fieldPath={`${key}.name`}
                  suggestionAPIUrl="/api/vocabularies/affiliations"
                  initialSuggestions={[initialAffiliations]}
                  serializeSuggestions={this.serializeAffiliations}
                  placeholder="Search or create affiliation'"
                  label={
                    <FieldLabel htmlFor={`${fieldPath}.name`} label={'Name'} />
                  }
                  noQueryMessage="Search for affiliations.."
                  fetchedOptions={fetchedOptions}
                  clearable
                />

                <IdentifiersField
                  fieldPath={`${key}.identifiers`}
                  labelIcon=""
                  schemeOptions={affiliationSchemes}
                />
                {array.length === 1 ? null : (
                  <Form.Field>
                    <Form.Field>
                      <label>&nbsp;</label>
                      <Button
                        icon
                        onClick={() => arrayHelpers.remove(indexPath)}
                      >
                        <Icon name="close" size="large" type="button" />
                      </Button>
                    </Form.Field>
                  </Form.Field>
                )}
              </>
            );
          }}
        </ArrayField>
      </>
    );
  }
}

AffiliationsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
};
