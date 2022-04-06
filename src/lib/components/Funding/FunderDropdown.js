// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';

import { Dropdown } from 'semantic-ui-react';
import { withState } from 'react-searchkit';
import { i18next } from '@translations/i18next';

export const FunderDropdown = withState(({ currentResultsState: awardsList, updateQueryState: updateQueryState }) => {
    const [fundersFromFacets] = useFundersFromFacets(awardsList);
  
    /**
     * TODO documentation
     * @param {*} event 
     * @param {*} data 
     */
    function onFunderSelect(event, data) {
      let newFilter = [];
  
      if (data && data.value !== "") {
        newFilter = ['funders', data.value]
      }
      updateQueryState({ filters: newFilter });
    }
  
    /**
     * TODO documentation
     * @param {*} awards 
     * @returns 
     */
    function useFundersFromFacets(awards) {
      const [result, setResult] = React.useState([]);
      React.useEffect(() => {
  
        /**
        * TODO documentation
        * @param {} awards
        * @returns 
        */
        function getFundersFromAwardsFacet() {
          if (awards.loading) {
            setResult([]);
            return;
          }
  
          const funders = awards.data.aggregations?.funders?.buckets.map((agg) => {
            return {
              key: agg.key,
              value: agg.key,
              text: agg.label
            };
          })
          setResult(funders);
        }
  
        getFundersFromAwardsFacet();
      }, [awards]);
  
      return [result];
    }
  
    // TODO the Dropdown width must be fixed to its widest option's width
    // TODO that can be done in invenio_app_rdm/theme/assets/less/theme/modules/dropdown.overrides
    // TODO so it can be reused later
    return (
      <Dropdown
        placeholder={i18next.t('Funder')}
        search
        selection
        clearable
        multiple={false}
        options={fundersFromFacets || []}
        allowAdditions={false}
        onChange={onFunderSelect}
        fluid={false}
        selectOnBlur={false}
        selectOnNavigation={false}
      />
    )
  });