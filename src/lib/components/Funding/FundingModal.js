// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Modal, Search, Icon } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  InvenioSearchApi,
  Toggle,
  ResultsLoader,
  EmptyResults,
  Error,
} from 'react-searchkit';
import { OverridableContext } from 'react-overridable';
import { Formik } from 'formik';
import { TextAreaField, TextField, ActionButton } from 'react-invenio-forms';
import * as Yup from 'yup';

import { AwardResults } from './AwardResults';

const ModalTypes = {
  STANDARD: 'standard',
  CUSTOM: 'custom',
};

const ModalActions = {
  ADD: 'add',
  EDIT: 'edit',
};

// const LicenseSchema = Yup.object().shape({
//   selectedLicense: Yup.object().shape({
//     title: Yup.string().required('Title is a required field.'),
//     link: Yup.string().url('Link must be a valid URL'),
//   }),
// });

const dummy = {
  funder: [
    {
      name: 'National Institutes of Health (US)',
      id: 'funder1',
      scheme: 'funderScheme1',
    },
    {
      name: 'European Commission (EU)',
      id: 'funder2',
      scheme: 'funderScheme2',
    },
  ],
  award: [
    {
      title: 'CANCER &AIDS DRUGS--PRECLIN PHARMACOL/TOXICOLOGY',
      number: 'N01CM037835-016',
      id: 'awardA',
      scheme: 'awardSchemeA',
      parentScheme: 'funderScheme1',
      parentId: 'funder1',
    },
    {
      title:
        'Beyond the Standard Model at the LHC and with Atom Interferometers.',
      number: '228169',
      id: 'awardB1',
      scheme: 'awardSchemeB',
      parentScheme: 'funderScheme2',
      parentId: 'funder2',
    },
    {
      title: 'Environmental Conditions in Glaucoma Patients',
      number: '747441',
      id: 'awardB2',
      scheme: 'awardSchemeB',
      parentScheme: 'funderScheme2',
      parentId: 'funder2',
    },
  ],
};

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
  };
  // TODO:
  // const searchApi = new InvenioSearchApi(searchConfig.searchApi);
  return (
    <Formik
      initialValues={{
        selectedAward: initialAward,
      }}
      onSubmit={onSubmit}
      // validationSchema={LicenseSchema}
    >
      <Modal
        onOpen={openModal}
        open={open}
        trigger={trigger}
        onClose={closeModal}
        closeIcon
      >
        <Modal.Header as="h6" className="deposit-modal-header">
          {mode === 'standard' ? 'Add standard award' : 'Add funder'}
        </Modal.Header>
        <Modal.Content>
          <div
            className="filters"
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            {/* <SearchBar
              autofocus
              actionProps={{
                icon: 'search',
                content: null,
                className: 'search',
              }}
            /> */}
            <Search />
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <Icon name="filter" />
              <Dropdown
                placeholder="Funder..."
                search
                selection
                options={dummy.funder.map(({ id, name }) => ({
                  key: id,
                  value: id,
                  text: name,
                }))}
              />
            </span>
          </div>
          <AwardResults dummy={dummy} />
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
  //   searchConfig: PropTypes.shape({
  //     searchApi: PropTypes.shape({
  //       axios: PropTypes.shape({
  //         headers: PropTypes.object,
  //       }),
  //     }).isRequired,
  //     initialQueryState: PropTypes.shape({
  //       filters: PropTypes.arrayOf(PropTypes.array),
  //     }).isRequired,
  //   }).isRequired,
  // serializeAwards: PropTypes.func,
};
