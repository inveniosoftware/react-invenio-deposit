// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Accordion, Form, Icon } from 'semantic-ui-react';
import { TextField, RemoteSelectField } from 'react-invenio-forms';

export function CustomAwardForm({ initialAward }) {
  const [accordionActive, setAccordionActive] = useState(true);

  return (
    <Form>
      <RemoteSelectField
        fieldPath="selectedAward.funder.id"
        // TODO: Use PROD URL eventually
        suggestionAPIUrl="http://127.0.0.1:9999/api/vocabularies/funders"
        suggestionAPIHeaders={{
          Accept: 'application/vnd.inveniordm.v1+json',
        }}
        placeholder={'Search for a funder by name'}
        clearable
        initialSuggestions={initialAward.funder ? [initialAward.funder] : []}
        serializeSuggestions={(funders) =>
          funders.map((funder) => ({
            text: funder.name,
            value: funder.id,
            key: funder.id,
          }))
        }
        label="Funder"
        noQueryMessage="Search for funder..."
        required
        onChange={(data, formikProps) => {
          // XXX: set funder name manually, as `RemoteSelectField`
          // only allows setting a single value via `fieldPath`.
          const funderId = data.value;
          if (funderId) {
            const name = data.options.find((op) => op.key === funderId).text;
            formikProps.form.setFieldValue('selectedAward.funder.name', name);
          }
        }}
      />
      <Accordion fluid styled>
        <Accordion.Title
          active={accordionActive}
          onClick={() => setAccordionActive(!accordionActive)}
        >
          <Icon name={`caret ${accordionActive ? 'down' : 'right'}`} />
          <strong>Custom award information</strong>
        </Accordion.Title>
        <Accordion.Content active={accordionActive}>
          <TextField
            label="Title"
            placeholder="Award title"
            fieldPath="selectedAward.award.title"
          ></TextField>
          <Form.Group widths="equal">
            <TextField
              label="Number"
              placeholder="Award number"
              fieldPath="selectedAward.award.number"
            ></TextField>
            <TextField
              label="Link"
              placeholder="Award link"
              fieldPath="selectedAward.award.link"
              type="url"
            ></TextField>
          </Form.Group>
        </Accordion.Content>
      </Accordion>
    </Form>
  );
}

CustomAwardForm.propTypes = {
  initialAward: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    number: PropTypes.string,
  }).isRequired,
};
