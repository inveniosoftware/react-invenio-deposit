// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActionButton, TextAreaField, TextField } from 'react-invenio-forms';
import { OverridableContext } from 'react-overridable';
import {
  EmptyResults,
  Error,
  InvenioSearchApi,
  ReactSearchKit,
  ResultsLoader,
  SearchBar,
  Toggle,
} from 'react-searchkit';
import { Form, Grid, Header, Menu, Modal } from 'semantic-ui-react';
import * as Yup from 'yup';
import { LicenseFilter } from './LicenseFilter';
import { LicenseResults } from './LicenseResults';

const overriddenComponents = {
  'SearchFilters.Toggle': LicenseFilter,
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
    title: Yup.string().required(i18next.t('Title is a required field.')),
    link: Yup.string().url(i18next.t('Link must be a valid URL')),
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
    // We have to close the modal first because onLicenseChange and passing
    // license as an object makes React get rid of this component. Otherwise
    // we get a memory leak warning.
    this.closeModal();
    this.props.onLicenseChange(values.selectedLicense);
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
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Modal
          onOpen={() => this.openModal()}
          open={this.state.open}
          trigger={this.props.trigger}
          onClose={this.closeModal}
          closeIcon={true}
          closeOnDimmerClick={false}
        >
          <Modal.Header as="h6" className="pt-10 pb-10">
            <Grid>
              <Grid.Column floated="left">
                <Header as="h2">
                  {this.props.action === ModalActions.ADD
                    ? i18next.t(`Add {{mode}} license`, {
                        mode: this.props.mode,
                      })
                    : i18next.t(`Change {{mode}} license`, {
                        mode: this.props.mode,
                      })}
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
                          placeholder={i18next.t('Search')}
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
                            title={i18next.t('Recommended')}
                            label="recommended"
                            filterValue={['tags', 'recommended']}
                          />
                          <Toggle
                            title={i18next.t('All')}
                            label="all"
                            filterValue={['tags', 'all']}
                          />
                          <Toggle
                            title={i18next.t('Data')}
                            label="data"
                            filterValue={['tags', 'data']}
                          />
                          <Toggle
                            title={i18next.t('Software')}
                            label="software"
                            filterValue={['tags', 'software']}
                          />
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
                  label={i18next.t('Title')}
                  placeholder={i18next.t('License title')}
                  fieldPath="selectedLicense.title"
                  required
                />
                <TextAreaField
                  fieldPath={'selectedLicense.description'}
                  label={i18next.t('Description')}
                />
                <TextField
                  label={i18next.t('Link')}
                  placeholder={i18next.t('License link')}
                  fieldPath="selectedLicense.link"
                />
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
              labelPosition="left"
              content={i18next.t('Cancel')}
              floated="left"
            />
            <ActionButton
              name="submit"
              onClick={(event, formik) => formik.handleSubmit(event)}
              primary
              icon="checkmark"
              labelPosition="left"
              content={
                this.props.action === ModalActions.ADD
                  ? i18next.t('Add license')
                  : i18next.t('Change license')
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
