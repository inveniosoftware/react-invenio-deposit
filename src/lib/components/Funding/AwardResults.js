// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import _get from 'lodash/get';
import { Item, Header, Radio } from 'semantic-ui-react';
import { FastField } from 'formik';

export function AwardResults({ dummy }) {
  const getAwardFunder = (funderId) =>
    dummy.funder.find((funder) => funder.id === funderId);

  const serializeAward = (award) => ({
    funder: getAwardFunder(award.parentId),
    award,
  });

  return (
    <FastField name="selectedAward">
      {({ form: { values, setFieldValue } }) => {
        debugger;
        return (
          <Item.Group>
            {dummy.award.map((award) => (
              <Item
                key={award.id}
                onClick={() =>
                  setFieldValue('selectedAward', serializeAward(award))
                }
              >
                <Radio
                  name="award"
                  checked={
                    _get(values, 'selectedAward.award.title') === award.title
                  }
                  onChange={() =>
                    setFieldValue('selectedAward', serializeAward(award))
                  }
                />
                <Item.Content className="license-item-content">
                  <Header size="small">{award.title}</Header>
                  <Item.Description className="license-item-description">
                    {getAwardFunder(award.parentId).name}
                  </Item.Description>
                </Item.Content>
              </Item>
            ))}
          </Item.Group>
        );
      }}
    </FastField>
  );
}
