// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { Item, Radio, Image } from 'semantic-ui-react';
import { withState } from 'react-searchkit';
import _get from 'lodash/get';
import { FastField } from 'formik';

export const LicenseResults = withState(({ currentResultsState: results }) => {
  return (
    <FastField name="selectedLicense">
      {({ form: { values, setFieldValue } }) => (
        <Item.Group>
          {results.data.hits.map((result) => {
            const title = result['title'];
            const description = result['description'];
            return (
              <Item
                key={title}
                onClick={() => setFieldValue('selectedLicense', result)}
                className="license-item"
              >
                <Image className="ui license-radiobox" verticalAlign="middle">
                  <Radio
                    checked={_get(values, 'selectedLicense.title') === title}
                    onChange={() => setFieldValue('selectedLicense', result)}
                  />
                </Image>
                <Item.Content>
                  <Item.Header>{title}</Item.Header>
                  <Item.Description>{description}</Item.Description>
                </Item.Content>
              </Item>
            );
          })}
        </Item.Group>
      )}
    </FastField>
  );
});
