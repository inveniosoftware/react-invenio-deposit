// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState, useEffect, createRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Dropdown, Grid, Modal, Icon } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
  ReactSearchKit,
  SearchBar,
  InvenioSearchApi,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination,
  withState
,} from 'react-searchkit';
import { OverridableContext } from 'react-overridable';
import { Formik } from 'formik';
import { ActionButton, RemoteSelectField } from 'react-invenio-forms';
import * as Yup from 'yup';

import { AwardResults } from './AwardResults';
import { CustomAwardForm } from './CustomAwardForm';
import { NoAwardResults } from './NoAwardResults';
import { i18next } from '@translations/i18next';

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
  const closeModal = () =>  setOpen(false);
  const onSubmit = (values, formikBag) => {
    closeModal();
    onAwardChange({award: values.selectedAward});
  };

  const searchApi = new InvenioSearchApi(searchConfig.searchApi);
  return (
    <Formik
      initialValues={{}}
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
            <CustomAwardForm />
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
const FunderDropdown = withState(({ currentResultsState: awardsList, updateQueryState: updateQueryState }) => {
  // TODO After querying and deleting, facets should show up again.
  const [fundersFromFacets] = useFundersFromFacets(awardsList);

  /**
   * TODO
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
 * TODO
 * @param {*} awards 
   * @param {*} awards 
 * @param {*} awards 
   * @param {*} awards 
 * @param {*} awards 
 * @returns 
   * @returns 
 * @returns 
   * @returns 
 * @returns 
 */
  function useFundersFromFacets(awards) {
    const [result, setResult] = React.useState([]);
    React.useEffect(() => {  // TODO there are two useEffect hooks of this. Is it ok?

      /**
      * TODO
      * @param {} awards
      * @returns 
      * @returns 
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

  return (
    // TODO selection is not being cleared properly
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

FundingModal.propTypes = {
  mode: PropTypes.oneOf(['standard', 'custom']).isRequired,
  action: PropTypes.oneOf(['add', 'edit']).isRequired,
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
