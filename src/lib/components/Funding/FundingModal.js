// This file is part of React-Invenio-Deposit
// Copyright (C) 2021-2022 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Grid, Modal } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  InvenioSearchApi,
  ResultsLoader,
  EmptyResults,
  Error,
  Pagination,
} from 'react-searchkit';
import { Formik } from 'formik';
import { ActionButton } from 'react-invenio-forms';
import * as Yup from 'yup';
import { i18next } from '@translations/i18next';

import { AwardResults } from './AwardResults';
import CustomAwardForm from './CustomAwardForm';
import { NoAwardResults } from './NoAwardResults';
import { FunderDropdown } from './FunderDropdown';

const ModalTypes = {
  STANDARD: 'standard',
  CUSTOM: 'custom',
};

const ModalActions = {
  ADD: 'add',
  EDIT: 'edit',
};

const StandardSchema = Yup.object().shape({
  selectedFunding: Yup.object().shape({
    funder: Yup.object().shape({
      id: Yup.string().required(),
    }),
    award: Yup.object().shape({
      id: Yup.string().required(),
    }),
  }),
});

const CustomFundingSchema = Yup.object().shape({
  selectedFunding: Yup.object().shape({
    funder: Yup.object().shape({
      id: Yup.string().required(i18next.t('Funder is required')),
    }),
    award: Yup.object().shape({
      title: Yup.string().test({
        name: 'testTitle',
        message: i18next.t('Title must be set alongside number'),
        test: function testTitle(value) {
          const { number } = this.parent;

          if (number && !value) {
            return false;
          }

          return true;
        }
      }),
      number: Yup.string().test({
        name: 'testNumber',
        message: i18next.t('Number must be set alongside title'),
        test: function testNumber(value) {
          const { title } = this.parent;

          if (title && !value) {
            return false;
          }

          return true;
        }
      }),
      url: Yup.string().url(i18next.t('Url Must be a valid url')).test({
        name: 'validateUrlDependencies',
        message: i18next.t('Url must be set alongside title and number.'),
        test: function testUrl(value) {
          const { title, number } = this.parent;

          console.log('url value ', value);
          if (value && value !== "" && !title && !number) {
            return false;
          }

          return true;
        }
      })
    }),
  })
});

function FundingModal({
  action,
  mode: initialMode,
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
  const customObject = mode === ModalTypes.CUSTOM ? props.initialFunding : {};
  const initialFunding = {
    selectedFunding: action === ModalActions.EDIT
      ? customObject
      : {},
  };

  const FundingSchema = mode === ModalTypes.CUSTOM ? CustomFundingSchema : StandardSchema;

  return (
    <Formik
      initialValues={initialFunding}
      onSubmit={onSubmit}
      validationSchema={FundingSchema}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize={true}
    >
      {({ values, resetForm }) => (
        <Modal
          centered={false}
          onOpen={openModal}
          open={open}
          trigger={trigger}
          onClose={closeModal}
          closeIcon
          closeOnDimmerClick={false}
        >
          <Modal.Header as="h6" className="pt-10 pb-10">
            {mode === 'standard' ? i18next.t('Add standard award') : i18next.t('Add custom award')}
          </Modal.Header>
          <Modal.Content>
            {mode === ModalTypes.STANDARD && (
              <ReactSearchKit
                searchApi={searchApi}
                appName="awards"
                urlHandlerApi={{ enabled: false }}
                initialQueryState={searchConfig.initialQueryState}
              >
                <Grid>
                  <Grid.Row>
                    <Grid.Column
                      width={11}
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
                    <Grid.Column width={5} floated="right" textAlign="right">
                      <FunderDropdown />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row verticalAlign="middle">
                    <Grid.Column>
                      <ResultsLoader>
                        <EmptyResults
                          extraContent={(
                            <NoAwardResults
                              switchToCustom={() => {
                                resetForm();
                                setMode(ModalTypes.CUSTOM);
                              }}
                            />
                          )}
                        />
                        <Error />
                        <AwardResults
                          deserializeAward={deserializeAward}
                          deserializeFunder={deserializeFunder}
                          computeFundingContents={computeFundingContents}
                        />
                      </ResultsLoader>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Pagination />
                  </Grid.Row>
                </Grid>
              </ReactSearchKit>
            )}
            {mode === ModalTypes.CUSTOM && (
              <CustomAwardForm
                deserializeFunder={deserializeFunder}
                selectedFunding={values.selectedFunding}
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
      )}
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
  computeFundingContents: PropTypes.func.isRequired,
  initialFunding: PropTypes.object,
};

export default FundingModal;
