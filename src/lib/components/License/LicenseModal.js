// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
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
import { LicenseFilter } from './LicenseFilter';
import { LicenseResults } from './LicenseResults';
import { Formik } from 'formik';
import { TextAreaField, TextField, ActionButton } from 'react-invenio-forms';
import * as Yup from 'yup';

const overriddenComponents = {
  'SearchFilters.ToggleComponent': LicenseFilter,
};

const ModalTypes = {
  STANDARD: 'standard',
  CUSTOM: 'custom',
};

const ModalActions = {
  ADD: 'add',
  EDIT: 'edit',
};

const LicenseSchema = Yup.object().shape({
  selectedLicense: Yup.object().shape({
    title: Yup.string().required('Title is a required field.'),
  }),
});

export class LicenseModal extends Component {
  state = {
    open: false,
  };

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  onSubmit = (values, formikBag) => {
    this.props.onLicenseChange(values.selectedLicense);
    formikBag.setSubmitting(false);
    formikBag.resetForm();
    this.closeModal();
  };

  render() {
    const initialLicense = this.props.initialLicense || {
      title: '',
      description: '',
      id: null,
      link: '',
    };
    const searchApi = new InvenioSearchApi(this.props.searchConfig.searchApi);
    return (
      <Formik
        initialValues={{
          selectedLicense: initialLicense,
        }}
        onSubmit={this.onSubmit}
        validationSchema={LicenseSchema}
      >
        <Modal
          onOpen={() => this.openModal()}
          open={this.state.open}
          trigger={this.props.trigger}
          onClose={this.closeModal}
          closeIcon
        >
          <Modal.Header as="h6" className="deposit-modal-header">
            <Grid>
              <Grid.Column floated="left">
                <Header as="h2">
                  {this.props.action === ModalActions.ADD
                    ? `Add ${this.props.mode} license`
                    : `Change ${this.props.mode} license`}
                </Header>
              </Grid.Column>
            </Grid>
          </Modal.Header>
          <Modal.Content scrolling>
            {this.props.mode === ModalTypes.STANDARD && (
              <OverridableContext.Provider value={overriddenComponents}>
                <ReactSearchKit
                  searchApi={searchApi}
                  appName={'licenses'}
                  urlHandlerApi={{ enabled: false }}
                  initialQueryState={this.props.searchConfig.initialQueryState}
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
                      <Grid.Column width={8} textAlign="right" floated="right">
                        <Menu compact>
                          <Toggle
                            title="Recommended"
                            label="recommended"
                            filterValue={['tags', 'recommended']}
                          ></Toggle>
                          <Toggle
                            title="All"
                            label="all"
                            filterValue={['tags', 'all']}
                          ></Toggle>
                          <Toggle
                            title="Data"
                            label="data"
                            filterValue={['tags', 'data']}
                          ></Toggle>
                          <Toggle
                            title="Software"
                            label="software"
                            filterValue={['tags', 'software']}
                          ></Toggle>
                        </Menu>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign="middle">
                      <Grid.Column>
                        <ResultsLoader>
                          <EmptyResults />
                          <Error />
                          <LicenseResults
                            {...(this.props.serializeLicenses && {
                              serializeLicenses: this.props.serializeLicenses,
                            })}
                          />
                        </ResultsLoader>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </ReactSearchKit>
              </OverridableContext.Provider>
            )}
            {this.props.mode === ModalTypes.CUSTOM && (
              <Form>
                <TextField
                  label="Title"
                  placeholder="License title"
                  fieldPath="selectedLicense.title"
                  required
                ></TextField>
                <TextAreaField
                  fieldPath={'selectedLicense.description'}
                  label={'Description'}
                />
                <TextField
                  label="Link"
                  placeholder="License link"
                  fieldPath="selectedLicense.link"
                ></TextField>
              </Form>
            )}
          </Modal.Content>
          <Modal.Actions>
            <ActionButton
              name="cancel"
              onClick={(values, formikBag) => {
                formikBag.resetForm();
                this.closeModal();
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
              content={
                this.props.action === ModalActions.ADD
                  ? 'Add license'
                  : 'Change license'
              }
            />
          </Modal.Actions>
        </Modal>
      </Formik>
    );
  }
}

LicenseModal.propTypes = {
  mode: PropTypes.oneOf(['standard', 'custom']).isRequired,
  action: PropTypes.oneOf(['add', 'edit']).isRequired,
  initialLicense: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  trigger: PropTypes.object.isRequired,
  onLicenseChange: PropTypes.func.isRequired,
  searchConfig: PropTypes.shape({
    searchApi: PropTypes.shape({
      axios: PropTypes.shape({
        headers: PropTypes.object,
      }),
    }).isRequired,
    initialQueryState: PropTypes.shape({
      filters: PropTypes.arrayOf(PropTypes.array),
    }).isRequired,
  }).isRequired,
  serializeLicenses: PropTypes.func,
};
