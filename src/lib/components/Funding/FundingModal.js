// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Header, Menu, Form } from 'semantic-ui-react';
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

export function FundingModal(props) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);

  const closeModal = () => setOpen(false);

  const onSubmit = (values, formikBag) => {
    props.onAwardChange(values.selectedAward);
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
  // const searchApi = new InvenioSearchApi(props.searchConfig.searchApi);
  return (
    <Formik
      initialValues={{
        selectedAward: props.initialAward,
      }}
      onSubmit={onSubmit}
      // validationSchema={LicenseSchema}
    >
      <Modal
        onOpen={() => openModal()}
        open={open}
        trigger={props.trigger}
        onClose={closeModal}
        closeIcon
      >
        <Modal.Header as="h6" className="deposit-modal-header">
          TODO
        </Modal.Header>
        <Modal.Content scrolling>TODO</Modal.Content>
        <Modal.Actions>TODO</Modal.Actions>
      </Modal>
    </Formik>
  );
}

// LicenseModal.propTypes = {
//   mode: PropTypes.oneOf(['standard', 'custom']).isRequired,
//   action: PropTypes.oneOf(['add', 'edit']).isRequired,
//   initialLicense: PropTypes.shape({
//     id: PropTypes.string,
//     title: PropTypes.string,
//     description: PropTypes.string,
//   }),
//   trigger: PropTypes.object.isRequired,
//   onLicenseChange: PropTypes.func.isRequired,
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
//   serializeLicenses: PropTypes.func,
// };
