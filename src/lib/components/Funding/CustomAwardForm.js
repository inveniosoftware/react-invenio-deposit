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
<<<<<<< HEAD
import { i18next } from '@translations/i18next';
export function CustomAwardForm({
  deserializeFunder
}) {
  const [accordionActive, setAccordionActive] = useState(false);

  function deserializeFunderToDropdown(funderItem) {
    let funderName = null;
    let funderPID = null;

    if (funderItem.name) {
      funderName = funderItem.name;
    }

    if (funderItem.pid) {
      funderPID = funderItem.pid;
    }

    if (!funderName && !funderPID) {
      return {};
    }


    return {
      text: funderName || funderPID,
      value: funderItem.id,
      key: funderItem.id,
      ...(funderName && { name: funderName }),
      ...(funderPID && { pid: funderPID })
    };
  }

  function serializeFunderFromDropdown(funderDropObject) {
    return {
      id: funderDropObject.key,
      ...(funderDropObject.name && { name: funderDropObject.name }),
      ...(funderDropObject.pid && { pid: funderDropObject.pid }),
    };
  }
=======

export function CustomAwardForm() {
  const [accordionActive, setAccordionActive] = useState(true);
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3

  return (
    <Form>
      <RemoteSelectField
<<<<<<< HEAD
        fieldPath="selectedFunding.funder.id"
=======
        fieldPath="selectedAward.funder.id"
        // TODO: Use PROD URL eventually
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
        suggestionAPIUrl="https://127.0.0.1:5000/api/funders"
        suggestionAPIHeaders={{
          // Accept: 'application/vnd.inveniordm.v1+json',
          // TODO why this header?
          Accept: 'application/json',
        }}
<<<<<<< HEAD
        placeholder={i18next.t('Search for a funder by name')}
        clearable
        initialSuggestions={[]}
        serializeSuggestions={(funders) =>
          funders.map((funder) => (deserializeFunderToDropdown(deserializeFunder(funder))))
        }
        label={i18next.t('Funder')}
        noQueryMessage={i18next.t('Search for funder...')}
        required
        multiple={false}
        onValueChange={({formikProps}, selectedFundersArray) => {
          if (selectedFundersArray.length === 1)  {
            const selectedFunder = selectedFundersArray[0];
            if (selectedFunder) {
              const deserializedFunder = serializeFunderFromDropdown(selectedFunder);
              formikProps.form.setFieldValue('selectedFunding.funder', deserializedFunder);
            }
=======
        placeholder={'Search for a funder by name'}
        clearable
        initialSuggestions={[]}
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
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
          }
        }}
      />
      <Accordion fluid styled>
        <Accordion.Title
          active={accordionActive}
          onClick={() => setAccordionActive(!accordionActive)}
        >
          <Icon name={`caret ${accordionActive ? 'down' : 'right'}`} />
<<<<<<< HEAD
          {accordionActive ? i18next.t('Custom award information') : i18next.t('Award information') }
        </Accordion.Title>
        <Accordion.Content active={accordionActive}>
          <TextField
            label={i18next.t("ID")}
            placeholder={i18next.t("Award id")}
            fieldPath="selectedFunding.award.id"
          />
          <Form.Group widths="equal">
            <TextField
              label={i18next.t("Number")}
              placeholder={i18next.t("Award number")}
              fieldPath="selectedFunding.award.number"
            />
            <TextField
              label={i18next.t("Title")}
              placeholder={i18next.t("Award Title")}
              fieldPath="selectedFunding.award.title"
            />
=======
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
              label="Title"
              placeholder="Award Title"
              fieldPath="selectedAward.award.title"
            ></TextField>
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
          </Form.Group>
        </Accordion.Content>
      </Accordion>
    </Form>
  );
}

CustomAwardForm.propTypes = {
<<<<<<< HEAD
  deserializeFunder: PropTypes.func.isRequired,
=======
  initialAward: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    number: PropTypes.string,
  }).isRequired,
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
};
