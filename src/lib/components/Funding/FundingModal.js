// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Dropdown, Grid, Modal, Icon } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  InvenioSearchApi,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination,
  withState
} from 'react-searchkit';
import { OverridableContext } from 'react-overridable';
import { Formik } from 'formik';
import { ActionButton } from 'react-invenio-forms';
import * as Yup from 'yup';

import { AwardResults } from './AwardResults';
import { CustomAwardForm } from './CustomAwardForm';
import { NoAwardResults } from './NoAwardResults';
import { i18next } from '@translations/i18next';
import { clone, cloneDeep } from 'lodash';

const overriddenComponents = {
  'awards.EmptyResults.element': NoAwardResults,
};

const ModalTypes = {
  STANDARD: 'standard',
  CUSTOM: 'custom',
};

const ModalActions = {
  ADD: 'add',
  EDIT: 'edit',
};

// TODO revisit this schema, does it makes sense?
const FundingSchema = Yup.object().shape({
  selectedAward: Yup.object().shape({
    funder: Yup.object().shape({
      id: Yup.string().required(i18next.t('Funder is a required field.')),
    }),
    award: Yup.object().shape({
      link: Yup.string().url(i18next.t('Link must be a valid URL')),
    }),
  }),
});

export function FundingModal({
  action,
  mode: initialMode,
  handleSubmit,
  trigger,
  onAwardChange,
  searchConfig,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(initialMode);

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setMode(initialMode);
    setOpen(false);
  };
  const onSubmit = (values, formikBag) => {
    onAwardChange(values.selectedAward);
    formikBag.setSubmitting(false);
    formikBag.resetForm();
    setMode(initialMode);
    closeModal();
  };

  const initialAward = props.initialAward || {
    award: {
      "pid": "",
    },
  };
  const searchApi = new InvenioSearchApi(searchConfig.searchApi);
  return (
    <Formik
      initialValues={{
        selectedAward: initialAward,
      }}
      onSubmit={onSubmit}
      validationSchema={FundingSchema}
    >
      <Modal
        onOpen={openModal}
        open={open}
        trigger={trigger}
        onClose={closeModal}
        closeIcon
      >
        <Modal.Header as="h6" className="pt-10 pb-10">
          {mode === 'standard' ? i18next.t('Add standard award') : i18next.t('Add missing')}
        </Modal.Header>
        <Modal.Content>
          {mode === ModalTypes.STANDARD && (
            <OverridableContext.Provider value={overriddenComponents}>
              <ReactSearchKit
                searchApi={searchApi}
                appName={'awards'}
                urlHandlerApi={{ enabled: false }}
                initialQueryState={searchConfig.initialQueryState}
                // suggestionApi={'/api/awards'} TODO can I do it? to implement suggester
              >
                <Grid>
                  <Grid.Row>
                    <Grid.Column
                      width={8}
                      floated="left"
                      verticalAlign="middle"
                    >
                      <SearchBar
                        autofocus // TODO not working
                        actionProps={{
                          icon: 'search',
                          content: null,
                          className: 'search',
                        }}
                      />
                    </Grid.Column>
                    {/* Dropdown implemented here */}
                    <Grid.Column width={8} floated="right" textAlign="right">
                      <span>
                        <Icon name="filter" />
                        <FunderDropdown/>
                      </span>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row verticalAlign='middle'>
                    <ResultsLoader>
                      <EmptyResults
                        switchToCustom={() => setMode(ModalTypes.CUSTOM)}
                      />
                      <Error />
                      <AwardResults
                        serializeAward={props.serializeAward}
                        computeFundingContents={props.computeFundingContents}
                      />
                    </ResultsLoader>
                  </Grid.Row>
                  <Grid.Row>
                    <Pagination />
                  </Grid.Row>
                </Grid>
              </ReactSearchKit>
            </OverridableContext.Provider>
          )}
          {mode === ModalTypes.CUSTOM && (
            <CustomAwardForm initialAward={initialAward} />
          )}
        </Modal.Content>
        <Modal.Actions>
          <ActionButton
            name="cancel"
            onClick={(values, formikBag) => {
              formikBag.resetForm();
              closeModal();
            }}
            icon="remove"
            content={i18next.t('Cancel')}
            floated="left"
          />
          <ActionButton
            name="submit"
            onClick={(event, formik) => formik.handleSubmit(event)}
            primary
            icon="checkmark"
            content={action === ModalActions.ADD ? i18next.t('Add award') : i18next.t('Change award')}
          />
        </Modal.Actions>
      </Modal>
    </Formik>
  );
}

/**
 * TODO implement in its own file
 */
const FunderDropdown = withState(({ currentResultsState: awardsList, currentQueryState: currentQueryState, updateQueryState: updateQueryState }) => {
  // TODO After querying and deleting, facets should show up again.
  const [fundersFromFacets] = useFundersFromFacets(awardsList);
  const [query, setQuery] = React.useState("");
  const [loadedFunders, loading] = useFundersAPI(query);

  /**
   * TODO
   * @param {*} event 
   * @param {*} data 
   */
  function onFunderSelect(event, data) {
    const newQueryState = cloneDeep(currentQueryState);
    const newFilters = updateFiltersArray(newQueryState.filters, ['funders', data.value]);
    newQueryState.filters = newFilters;
    console.log("New filters");
    console.log(newQueryState.filters);
    updateQueryState(newQueryState); // TODO can I trigger updateQueryFilters directly?
    // TODO query is returning all awards
  }

  /**
   * Updates a query's filter array with a new entry.
   * A new array is returned.
   * 
   * @param {*} filters 
   */
  function updateFiltersArray(filters, newFilterEntry) {

    let newFilters = [];

    // New entry is invalid, format is [field, value]
    if (newFilterEntry.length !== 2) {
      return cloneDeep(array);
    }

    // Filters are empty, push the new entry if it has any value set.
    if (filters.length === 0) {
      if (newFilterEntry[1] !== "") {
        newFilters.push(newFilterEntry);
      }

      return newFilters;
    }

    let tmpFilterEntry;

    // Iterate filters and update them if needed.
    filters.forEach(filter => {
      tmpFilterEntry = computeNewFilter(filter, newFilterEntry);
      if (tmpFilterEntry.length) {
        newFilters.push(tmpFilterEntry);
      }
    });

    return newFilters;

    /**
     * This method computes an array given two arrays.
     * Each array represents a query 'filter' as ['field', 'value'].
     * If the given filters are the same, one of the following applies:
     * 1 - filter's value is changed, if it has a new value.
     * 2 - filter is discarded, if it has not a new value.
     * 
     * @param {array} filter 
     * @param {array} newFilter 
     * 
     * @returns {array} new filter's representation 
     */
    function computeNewFilter(filter, newFilter) {
      if (newFilter.length !== 2 || filter.length !== 2) {
        return [];
      }

      let [newFilterField, newFilterValue] = newFilter;

      if (filter[0] === newFilterField) {
        if (newFilterValue !== "") {
          return newFilter;
        }
        return [];
      }
      return filter;
    }
  }

  // TODO since it is memoized, 'timer' persists between re-renders meaning that 
  // TODO the timer will be updated on every keystroke.
  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer)
        clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  /**
   * TODO
   */
  const debounceCb = React.useCallback(debounce(handleDropdownSearchChange), []);

  /**
   * TODO
   * @param {*} awards 
   * @returns 
   */
  function useFundersFromFacets(awards) {
    const [result, setResult] = React.useState([]);
    React.useEffect(() => {  // TODO there are two useEffect hooks of this. Is it ok?

      /**
      * TODO
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
            text: agg.key
          };
        })
        setResult(funders);
      }

      getFundersFromAwardsFacet();
    }, [awards]);

    return [result];
  }

  /**
   * Hook to query funder's API.
   * When 'query' changes, the hook will be executed and a request is going to be executed to retrieve
   * funders from the API.
   * 
   * TODO 
   * @param {*} query 
   * @returns 
   */
  function useFundersAPI(query) {
    console.log('useFundersAPI');

    const [result, setResult] = React.useState([]);
    const [loading, setLoading] = React.useState(false); // TODO can we use already built components from react search kit?


    /**
     * Auxiliary function to serialize a funder to match the dropdown's schema. 
     * 
     * @param {object} funder
     * @param {string} funder.pid 
     * @param {string} [funder.acronym]
     * @param {string} [funder.name] 
     * 
     * @returns 
     */
    function serializeFunderToDropdown(funder) {
      if (!funder || !funder.pid) {
        return {};
      }

      return {
        key: funder.pid,
        value: funder.pid,
        text: funder.acronym || funder.name || funder.pid
      }
    }

    React.useEffect(() => {
      /**
       * TODO
       * @returns 
       */
      async function searchFunders() {
        if (query === "") {
          setResult([]);
          return;
        }
        setLoading(true);
        axios
          .get(`https://127.0.0.1:5000/api/funders?q=${query}`, {
            headers: { 'Content-Type': 'application/json' },
          })
          .then((res) => {
            setResult(
              res.data.hits.hits.map((funder) =>
                (serializeFunderToDropdown(funder))
              )
            );
          })
          .catch((error) => {
            setResult([]);
            setLoading(null);
          });
      }

      searchFunders();

    }, [query]);

    return [result, loading]
  }

  return (
    // TODO selection is not being cleared properly
    <Dropdown
      placeholder={i18next.t('Funder')}
      search
      selection
      clearable
      options={
        loadedFunders.length ? loadedFunders : fundersFromFacets
      }
      onSearchChange={(e, value) => debounceCb(value)}
      onChange={onFunderSelect}
    />
  )



  /**
   * TODO
   * @param {*} e 
   * @param {*} value 
   */
  function handleDropdownSearchChange(value) {
    setQuery(value.searchQuery);
  }
});

FundingModal.propTypes = {
  mode: PropTypes.oneOf(['standard', 'custom']).isRequired,
  action: PropTypes.oneOf(['add', 'edit']).isRequired,
  initialAward: PropTypes.shape({
    pid: PropTypes.string
  }),
  trigger: PropTypes.object.isRequired,
  onAwardChange: PropTypes.func.isRequired,
  searchConfig: PropTypes.shape({
    searchApi: PropTypes.shape({
      axios: PropTypes.shape({
        headers: PropTypes.object,
      }),
    }).isRequired,
    initialQueryState: PropTypes.object.isRequired,
  }).isRequired,
  serializeAward: PropTypes.func.isRequired,
  computeFundingContents: PropTypes.func.isRequired
};
