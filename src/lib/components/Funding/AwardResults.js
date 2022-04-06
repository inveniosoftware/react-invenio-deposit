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

export const AwardResults = withState(({ currentResultsState: results, deserializeAward, deserializeFunder, computeFundingContents }) => {
  return (
    <FastField name="selectedFunding">
      {({ form: { values, setFieldValue } }) => {
        return (
          <Item.Group>
            {results.data.hits.map((award) => {
              // TODO check internationalization and unprotected accesses
              let funder = award?.funder;
              const deserializedAward = deserializeAward(award);
              const deserializedFunder = deserializeFunder(funder);
              const funding = {
                award: deserializedAward,
                funder: deserializedFunder
              }
              // TODO this is being run when the item is selected. Memoized?
              let { headerContent, descriptionContent, awardOrFunder } = computeFundingContents(funding);

              return (
                <Item
                  key={deserializedAward.id} // TODO this key might not be unique
                  onClick={() =>
                    setFieldValue('selectedFunding', funding)
                  }
                  className="license-item"
                >
                  {/* TODO selectedFunding is not being cleared after submitting */}
                  <Radio
                    checked={
                      _get(values, 'selectedFunding.award.pid') === funding.award.pid
                    }
                    onChange={() =>
                      setFieldValue('selectedFunding', funding)
                    }
                  />
                  <Item.Content className="license-item-content">
                    <Header size="small">
                      {headerContent}
                      {awardOrFunder === 'award'
                        ? (award.number && (
                          <Label basic size="mini">
                            {award.number}
                          </Label>
                        )) 
                        : ''
                      }
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
  deserializeAward: PropTypes.func.isRequired,
  deserializeFunder: PropTypes.func.isRequired,
  computeFundingContents: PropTypes.func.isRequired
};
