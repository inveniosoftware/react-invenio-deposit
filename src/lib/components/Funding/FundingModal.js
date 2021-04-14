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
} from 'react-searchkit';
import { OverridableContext } from 'react-overridable';
import { Formik } from 'formik';
import { ActionButton } from 'react-invenio-forms';
import * as Yup from 'yup';

import { AwardResults } from './AwardResults';
import { CustomAwardForm } from './CustomAwardForm';

const ModalTypes = {
  STANDARD: 'standard',
  CUSTOM: 'custom',
};

const ModalActions = {
  ADD: 'add',
  EDIT: 'edit',
};

// const AwardSchema = Yup.object().shape({
//   selectedAward: Yup.object().shape({
//     title: Yup.string().required('Title is a required field.'),
//     link: Yup.string().url('Link must be a valid URL'),
//   }),
// });

export function FundingModal({
  action,
  mode,
  handleSubmit,
  trigger,
  onAwardChange,
  searchConfig,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const [fundersWithAwards, setFundersWithAwards] = useState([]);

  useEffect(() => {
    if (open) {
      axios
        // FIXME: use PROD url
        .get('http://127.0.0.1:9999/api/vocabularies/funders/awards', {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          setFundersWithAwards(res.data.hits.hits);
        })
        .catch((err) => console.log(err));
    }
  }, [open]);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const onSubmit = (values, formikBag) => {
    onAwardChange(values.selectedAward);
    formikBag.setSubmitting(false);
    formikBag.resetForm();
    closeModal();
  };

  const initialAward = props.initialAward || {
    title: '',
    id: null,
    number: '',
    link: '',
  };
  const searchApi = new InvenioSearchApi(searchConfig.searchApi);
  return (
    <Formik
      initialValues={{
        selectedAward: initialAward,
      }}
      onSubmit={onSubmit}
      // validationSchema={AwardSchema}
    >
      <Modal
        onOpen={openModal}
        open={open}
        trigger={trigger}
        onClose={closeModal}
        closeIcon
      >
        <Modal.Header as="h6" className="deposit-modal-header">
          {mode === 'standard' ? 'Add standard award' : 'Add missing'}
        </Modal.Header>
        <Modal.Content>
          {mode === ModalTypes.STANDARD && (
            <ReactSearchKit
              searchApi={searchApi}
              appName={'awards'}
              urlHandlerApi={{ enabled: false }}
              // initialQueryState={props.searchConfig.initialQueryState}
            >
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8} floated="left" verticalAlign="middle">
                    <SearchBar
                      autofocus
                      actionProps={{
                        icon: 'search',
                        content: null,
                        className: 'search',
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column width={8} floated="right" textAlign="right">
                    <span>
                      <Icon name="filter" />
                      <Dropdown
                        placeholder="Funder..."
                        search
                        selection
                        options={fundersWithAwards.map(({ id, name }) => ({
                          key: id,
                          value: id,
                          text: name,
                        }))}
                      />
                    </span>
                  </Grid.Column>
                </Grid.Row>
                <ResultsLoader>
                  <EmptyResults />
                  <Error />
                  <AwardResults />
                </ResultsLoader>
              </Grid>
            </ReactSearchKit>
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
            content="Cancel"
            floated="left"
          />
          <ActionButton
            name="submit"
            onClick={(event, formik) => formik.handleSubmit(event)}
            primary
            icon="checkmark"
            content={action === ModalActions.ADD ? 'Add award' : 'Change award'}
          />
        </Modal.Actions>
      </Modal>
    </Formik>
  );
}

FundingModal.propTypes = {
  mode: PropTypes.oneOf(['standard', 'custom']).isRequired,
  action: PropTypes.oneOf(['add', 'edit']).isRequired,
  initialAward: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    number: PropTypes.string,
  }),
  trigger: PropTypes.object.isRequired,
  onAwardChange: PropTypes.func.isRequired,
  searchConfig: PropTypes.shape({
    searchApi: PropTypes.shape({
      axios: PropTypes.shape({
        headers: PropTypes.object,
      }),
    }).isRequired,
    // initialQueryState: PropTypes.shape({
    //   filters: PropTypes.arrayOf(PropTypes.array),
    // }).isRequired,
  }).isRequired,
  // serializeAwards: PropTypes.func,
};
