// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Header, Form } from 'semantic-ui-react';
import { Formik } from 'formik';
import {
  SelectField,
  RemoteSelectField,
  TextField,
  ActionButton,
  ToggleField,
} from 'react-invenio-forms';
import * as Yup from 'yup';
import _get from 'lodash/get';
import _find from 'lodash/find';
import _map from 'lodash/map';
import { CreatibutorsIdentifiers } from './CreatibutorsIdentifiers';
import { CREATIBUTOR_TYPE } from './type';

const ModalActions = {
  ADD: 'add',
  EDIT: 'edit',
};

export class CreatibutorsModal extends Component {
  state = {
    open: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  displayActionLabel = () => {
    return this.props.action === ModalActions.ADD
      ? this.props.addLabel
      : this.props.editLabel;
  };

  /**
   * Function to transform formik creatibutor state
   * back to the external format.
   */
  serializeCreatibutor = (submittedCreatibutor) => {
    const findField = (arrayField, key, value) => {
      const knownField = _find(arrayField, {
        [key]: value,
      });
      return knownField ? knownField : { [key]: value };
    };
    const identifiersFieldPath = 'person_or_org.identifiers';
    const affiliationsFieldPath = 'affiliations';
    // The modal is saving only identifiers values, thus
    // identifiers with existing scheme are trimmed
    // Here we merge back the known scheme for the submitted identifiers
    const initialIdentifiers = _get(
      this.props.initialCreatibutor,
      identifiersFieldPath,
      []
    );
    const submittedIdentifiers = _get(
      submittedCreatibutor,
      identifiersFieldPath,
      []
    );
    const identifiers = submittedIdentifiers.map((identifier) => {
      return findField(initialIdentifiers, 'identifier', identifier);
    });

    const initialAffilliations = _get(
      this.props.initialCreatibutor,
      affiliationsFieldPath,
      []
    );
    const affiliations = submittedCreatibutor.affiliations.map(
      (affiliation) => {
        return findField(initialAffilliations, 'name', affiliation);
      }
    );

    return {
      ...submittedCreatibutor,
      person_or_org: {
        ...submittedCreatibutor.person_or_org,
        identifiers,
      },
      affiliations,
    };
  };

  /**
   * Function to transform creatibutor object
   * to formik initialValues. The function is converting
   * the array of objects fields e.g `identifiers`, `affiliations`
   * to simple arrays. This is needed as SUI dropdowns accept only
   * array of strings as values.
   */
  deserializeCreatibutor = (initialCreatibutor) => {
    const identifiersFieldPath = 'person_or_org.identifiers';

    return {
      // default type to personal
      person_or_org: {
        type: CREATIBUTOR_TYPE.PERSON,
        ...initialCreatibutor.person_or_org,
        identifiers: _map(
          _get(initialCreatibutor, identifiersFieldPath, []),
          'identifier'
        ),
      },
      affiliations: _map(_get(initialCreatibutor, 'affiliations', []), 'name'),
      role: _get(initialCreatibutor, 'role', ''),
    };
  };

  isCreator = () => this.props.schema === 'creators';

  onSubmit = (values, formikBag) => {
    this.props.onCreatibutorChange(this.serializeCreatibutor(values));
    formikBag.setSubmitting(false);
    formikBag.resetForm();
  };

  render() {
    const initialCreatibutor = this.props.initialCreatibutor;
    const ActionLabel = () => this.displayActionLabel();
    return (
      <Formik
        initialValues={this.deserializeCreatibutor(initialCreatibutor)}
        onSubmit={this.onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, resetForm }) => {
          const personOrOrgPath = `person_or_org`;
          const typeFieldPath = `${personOrOrgPath}.type`;
          const familyNameFieldPath = `${personOrOrgPath}.family_name`;
          const givenNameFieldPath = `${personOrOrgPath}.given_name`;
          const nameFieldPath = `${personOrOrgPath}.name`;
          const identifiersFieldPath = `${personOrOrgPath}.identifiers`;
          const affiliationsFieldPath = 'affiliations';
          const roleFieldPath = 'role';
          return (
            <Modal
              onOpen={() => this.openModal()}
              open={this.state.open}
              trigger={this.props.trigger}
              onClose={() => {
                this.closeModal();
                resetForm();
              }}
            >
              <Modal.Header as="h6" className="license-modal-header">
                <Grid>
                  <Grid.Column floated="left" width={4}>
                    <Header as="h2">
                      <ActionLabel />
                    </Header>
                  </Grid.Column>
                </Grid>
              </Modal.Header>
              <Modal.Content>
                <Form>
                  <Form.Field>
                    <ToggleField
                      fieldPath={typeFieldPath}
                      onValue={CREATIBUTOR_TYPE.PERSON}
                      offValue={CREATIBUTOR_TYPE.ORGANIZATION}
                      onLabel="Person"
                      offLabel="Organization"
                      onChange={({ checked }) => {
                        // If the toggle was checked
                        if (checked) {
                          const organizationName = _get(
                            values,
                            nameFieldPath,
                            ''
                          );
                          // If organization.name was filled set it to `family_name`
                          if (organizationName) {
                            setFieldValue(
                              familyNameFieldPath,
                              organizationName
                            );
                            // // Clear organization name
                            setFieldValue(nameFieldPath, '');
                          }
                        } else {
                          const familyName = _get(
                            values,
                            familyNameFieldPath,
                            ''
                          );
                          // If person.family_name was filled set it to `name`
                          if (familyName) {
                            setFieldValue(nameFieldPath, familyName);
                            // // Clear family name
                            setFieldValue(familyNameFieldPath, '');
                          }
                        }
                        // Clear given_name always
                        setFieldValue(givenNameFieldPath, '');
                      }}
                    />
                  </Form.Field>
                  <Form.Group widths="equal">
                    {_get(values, typeFieldPath, '') ===
                    CREATIBUTOR_TYPE.PERSON ? (
                      <>
                        <TextField
                          label="Family name"
                          placeholder="Family name"
                          fieldPath={familyNameFieldPath}
                          required={this.isCreator()}
                        />
                        <TextField
                          label="Given name(s)"
                          placeholder="Given name"
                          fieldPath={givenNameFieldPath}
                          required={this.isCreator()}
                        />
                      </>
                    ) : (
                      <TextField
                        label="Name"
                        placeholder="Organization name"
                        fieldPath={nameFieldPath}
                        required={this.isCreator()}
                      />
                    )}
                  </Form.Group>
                  <CreatibutorsIdentifiers
                    initialOptions={_map(
                      _get(values, identifiersFieldPath, []),
                      (identifier) => ({
                        text: identifier,
                        value: identifier,
                        key: identifier,
                      })
                    )}
                    fieldPath={identifiersFieldPath}
                  />
                  <RemoteSelectField
                    fieldPath={affiliationsFieldPath}
                    suggestionAPIUrl="/api/vocabularies/affiliations"
                    placeholder={'Search for an affiliation by name'}
                    clearable
                    multiple
                    initialSuggestions={_get(
                      initialCreatibutor,
                      'affiliations',
                      []
                    )}
                    serializeSuggestions={(affiliations) =>
                      _map(affiliations, (affiliation) => ({
                        text: affiliation.name,
                        value: affiliation.name,
                        key: affiliation.name,
                      }))
                    }
                    label="Affiliations"
                    noQueryMessage="Search for affiliations..."
                    allowAdditions
                  />
                  <SelectField
                    fieldPath={roleFieldPath}
                    label={'Role'}
                    options={this.props.roleOptions}
                    placeholder="Select role"
                    clearable
                    required={!this.isCreator()}
                  />
                </Form>
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
                {this.props.action === ModalActions.ADD && (
                  <ActionButton
                    name="submit"
                    onClick={(event, formik) => formik.handleSubmit(event)}
                    primary
                    icon="checkmark"
                    content="Save and add another"
                  />
                )}
                <ActionButton
                  name="submit"
                  onClick={(event, formik) => {
                    formik.handleSubmit(event);
                    this.closeModal();
                  }}
                  primary
                  icon="checkmark"
                  content="Save"
                />
              </Modal.Actions>
            </Modal>
          );
        }}
      </Formik>
    );
  }
}

CreatibutorsModal.propTypes = {
  schema: PropTypes.oneOf(['creators', 'contributors']).isRequired,
  action: PropTypes.oneOf(['add', 'edit']).isRequired,
  addLabel: PropTypes.string.isRequired,
  editLabel: PropTypes.string.isRequired,
  initialCreatibutor: PropTypes.shape({
    id: PropTypes.string,
    person_or_org: PropTypes.shape({
      family_name: PropTypes.string,
      given_name: PropTypes.string,
      name: PropTypes.string,
      identifiers: PropTypes.arrayOf(
        PropTypes.shape({
          scheme: PropTypes.string,
          identifier: PropTypes.string,
        })
      ),
    }),
    affiliations: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        identifiers: PropTypes.arrayOf(
          PropTypes.shape({
            scheme: PropTypes.string,
            identifier: PropTypes.string,
          })
        ),
      })
    ),
    role: PropTypes.string,
  }),
  trigger: PropTypes.object.isRequired,
  onCreatibutorChange: PropTypes.func.isRequired,
  roleOptions: PropTypes.array,
};

CreatibutorsModal.defaultProps = {
  roleOptions: [],
  initialCreatibutor: {},
};
