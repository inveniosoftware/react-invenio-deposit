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

  return (
    <Form>
      <RemoteSelectField
        fieldPath="selectedFunding.funder.id"
        suggestionAPIUrl="https://127.0.0.1:5000/api/funders"
        suggestionAPIHeaders={{
          // Accept: 'application/vnd.inveniordm.v1+json',
          // TODO why this header?
          Accept: 'application/json',
        }}
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
          }
        }}
      />
      <Accordion fluid styled>
        <Accordion.Title
          active={accordionActive}
          onClick={() => setAccordionActive(!accordionActive)}
        >
          <Icon name={`caret ${accordionActive ? 'down' : 'right'}`} />
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
          </Form.Group>
        </Accordion.Content>
      </Accordion>
    </Form>
  );
}

CustomAwardForm.propTypes = {
  deserializeFunder: PropTypes.func.isRequired,
};
