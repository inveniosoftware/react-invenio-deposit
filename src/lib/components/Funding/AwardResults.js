// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { Item, Header, Radio, Label } from 'semantic-ui-react';
import { withState } from 'react-searchkit';
import { FastField } from 'formik';

export const AwardResults = withState(({ currentResultsState: results, serializeAward: serializeAward, computeFundingContents: computeFundingContents }) => {
  return (
    <FastField name="selectedAward">
      {({ form: { values, setFieldValue } }) => {
        return (
          <Item.Group>
            {results.data.hits.map((award) => {
              // TODO check internationalization and unprotected accesses
              const serializedAward = serializeAward(award);
              let { headerContent, descriptionContent } = computeFundingContents(serializedAward);

              return (
                <Item
                  key={serializedAward.pid} // TODO this key might not be unique
                  onClick={() =>
                    setFieldValue('selectedAward', serializedAward)
                  }
                  className="license-item"
                >
                  <Radio
                    checked={
                      _get(values, 'selectedAward.pid') === serializedAward.pid
                    }
                    onChange={() =>
                      setFieldValue('selectedAward', serializedAward)
                    }
                  />
                  <Item.Content className="license-item-content">
                    <Header size="small">
                      {headerContent}
                      {award.number && (
                        <Label basic size="mini">
                          {award.number}
                        </Label>
                      )}
                    </Header>
                    <Item.Description className="license-item-description">
                      {descriptionContent}
                    </Item.Description>
                  </Item.Content>
                </Item>
              )
            })}
          </Item.Group>
        );
      }}
    </FastField>
  );
});

AwardResults.propTypes = {
  serializeAward: PropTypes.func.isRequired,
  currentResultsState: PropTypes.object.isRequired,
  computeFundingContents: PropTypes.func.isRequired
};
