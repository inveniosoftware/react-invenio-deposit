// This file is part of React-Invenio-Deposit
// Copyright (C) 2021-2022 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Grid, Modal, Icon } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import {
  ReactSearchKit,
  SearchBar,
  InvenioSearchApi,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination
} from 'react-searchkit';
import { OverridableContext } from 'react-overridable';
import { Formik } from 'formik';
import { ActionButton } from 'react-invenio-forms';
import * as Yup from 'yup';
import { i18next } from '@translations/i18next';

import { AwardResults } from './AwardResults';
import { CustomAwardForm } from './CustomAwardForm';
import { NoAwardResults } from './NoAwardResults';
import { FunderDropdown } from './FunderDropdown';

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
// TODO oneOf funder or award must be provided
const FundingSchema = Yup.object().shape({
  selectedFunding: Yup.object().shape({
    funder: Yup.object().shape({
      id: Yup.string().required(i18next.t('Funder ID is a required field.')),
      name: Yup.string().optional(),
      pid: Yup.string().optional()
    }).optional(),
    award: Yup.object().shape({
      title: Yup.string(),
      number: Yup.number().optional(),
      id: Yup.string().required(i18next.t('Award ID is a required field.'))
    }).optional()
  })
});

export function FundingModal({
  action,
  mode: initialMode,
  handleSubmit,
  trigger,
  onAwardChange,
  searchConfig,
  deserializeAward,
  deserializeFunder,
  computeFundingContents,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(initialMode);
  console.log('mode');
  console.log(mode);
  const openModal = () => setOpen(true);
  const closeModal = () => {
    setMode(initialMode);
    setOpen(false);
  };  
  const onSubmit = (values, formikBag) => {
    formikBag.setSubmitting(false);
    formikBag.resetForm();
    setMode(initialMode);
    closeModal();
    onAwardChange(values.selectedFunding);
  };

  const searchApi = new InvenioSearchApi(searchConfig.searchApi);
  const initialFunding =
  {
    selectedFunding:  action === ModalActions.EDIT
    ? mode === ModalTypes.CUSTOM ? props.initialFunding : {}
    : {} 
  };

  console.log('loaded funding');
  console.log(initialFunding);
  return (
    <Formik
      initialValues={initialFunding}
      onSubmit={onSubmit}
      validationSchema={FundingSchema}
      validateOnChange={false}
      validateOnBlur={false}
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
                        autofocus
                        actionProps={{
                          icon: 'search',
                          content: null,
                          className: 'search',
                        }}
                      />
                    </Grid.Column>
                    {/* Dropdown implemented here */}
                    <Grid.Column width={8} floated="right" textAlign="right">
                        <Icon name="filter" />
                        <FunderDropdown/>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row verticalAlign='middle'>
                    <ResultsLoader>
                      {/* TODO switch to custom is being passed as 'undefined' and throws an error */}
                      {/* TODO check whether it has something to do with react-searchkit / react-overridable */}
                      {/* TODO maybe the component (NoAwardResults) is being rendered before the prop is injected */}
                      <EmptyResults
                        switchToCustom={() => setMode(ModalTypes.CUSTOM)}
                      />
                      <Error />
                      <AwardResults
                        deserializeAward={deserializeAward}
                        deserializeFunder={deserializeFunder}
                        computeFundingContents={computeFundingContents}
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
            <CustomAwardForm 
             deserializeFunder={deserializeFunder}
            />
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
  deserializeAward: PropTypes.func.isRequired,
  deserializeFunder: PropTypes.func.isRequired,
  computeFundingContents: PropTypes.func.isRequired
};
