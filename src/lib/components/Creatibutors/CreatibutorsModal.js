// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Header, Form, Ref } from 'semantic-ui-react';
import { Formik, getIn } from 'formik';
import {
  SelectField,
  TextField,
  ActionButton,
  RadioField,
} from 'react-invenio-forms';
import * as Yup from 'yup';
import _get from 'lodash/get';
import _find from 'lodash/find';
import _map from 'lodash/map';
import { AffiliationsField } from './../AffiliationsField';
import { CreatibutorsIdentifiers } from './CreatibutorsIdentifiers';
import { CREATIBUTOR_TYPE } from './type';
import { i18next } from '@translations/i18next';

const ModalActions = {
  ADD: 'add',
  EDIT: 'edit',
};

export class CreatibutorsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      saveAndContinueLabel: i18next.t('Save and add another'),
      action: null,
    };
    this.inputRef = createRef();
  }

  CreatorSchema = Yup.object({
    person_or_org: Yup.object({
      type: Yup.string(),
      family_name: Yup.string().when('type', (type, schema) => {
        if (type === CREATIBUTOR_TYPE.PERSON && this.isCreator()) {
          return schema.required(i18next.t('Family name is a required field.'));
        }
      }),
      name: Yup.string().when('type', (type, schema) => {
        if (type === CREATIBUTOR_TYPE.ORGANIZATION && this.isCreator()) {
          return schema.required(i18next.t('Name is a required field.'));
        }
      }),
    }),
    role: Yup.string().when('_', (_, schema) => {
      if (!this.isCreator()) {
        return schema.required(i18next.t('Role is a required field.'));
      }
    }),
  });

  focusInput = () => this.inputRef.current.focus();

  openModal = () => {
    this.setState({ open: true, action: null }, () => {
      this.focusInput();
    });
  };

  closeModal = () => {
    this.setState({ open: false, action: null });
  };

  changeContent = () => {
    this.setState({ saveAndContinueLabel: i18next.t('Added') });
    // change in 2 sec
    setTimeout(() => {
      this.setState({
        saveAndContinueLabel: i18next.t('Save and add another'),
      });
    }, 2000);
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

    const submittedAffiliations = _get(
      submittedCreatibutor,
      affiliationsFieldPath,
      []
    );

    return {
      ...submittedCreatibutor,
      person_or_org: {
        ...submittedCreatibutor.person_or_org,
        identifiers,
      },
      affiliations: submittedAffiliations,
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
      affiliations: _get(initialCreatibutor, 'affiliations', []),
      role: _get(initialCreatibutor, 'role', ''),
    };
  };

  isCreator = () => this.props.schema === 'creators';

  onSubmit = (values, formikBag) => {
    this.props.onCreatibutorChange(this.serializeCreatibutor(values));
    formikBag.setSubmitting(false);
    formikBag.resetForm();
    switch (this.state.action) {
      case 'saveAndContinue':
        // Needed to close and open the modal to reset the internal
        // state of the cmp inside the modal
        this.closeModal();
        this.openModal();
        this.changeContent();
        break;
      case 'saveAndClose':
        this.closeModal();
        break;
      default:
        break;
    }
  };

  render() {
    const initialCreatibutor = this.props.initialCreatibutor;
    const ActionLabel = () => this.displayActionLabel();
    return (
      <Formik
        initialValues={this.deserializeCreatibutor(initialCreatibutor)}
        onSubmit={this.onSubmit}
        enableReinitialize
        validationSchema={this.CreatorSchema}
        validateOnChange={false}
        validateOnBlur={false}
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
              closeIcon
            >
              <Modal.Header as="h6" className="deposit-modal-header">
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
                  <Form.Group>
                    <RadioField
                      fieldPath={typeFieldPath}
                      label={i18next.t('Person')}
                      checked={
                        _get(values, typeFieldPath) === CREATIBUTOR_TYPE.PERSON
                      }
                      value={CREATIBUTOR_TYPE.PERSON}
                      onChange={({ event, data, formikProps }) => {
                        formikProps.form.setFieldValue(
                          typeFieldPath,
                          CREATIBUTOR_TYPE.PERSON
                        );
                        this.focusInput();
                      }}
                      optimized
                    />
                    <RadioField
                      fieldPath={typeFieldPath}
                      label={i18next.t('Organization')}
                      checked={
                        _get(values, typeFieldPath) ===
                        CREATIBUTOR_TYPE.ORGANIZATION
                      }
                      value={CREATIBUTOR_TYPE.ORGANIZATION}
                      onChange={({ event, data, formikProps }) => {
                        formikProps.form.setFieldValue(
                          typeFieldPath,
                          CREATIBUTOR_TYPE.ORGANIZATION
                        );
                        this.focusInput();
                      }}
                      optimized
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    {_get(values, typeFieldPath, '') ===
                    CREATIBUTOR_TYPE.PERSON ? (
                      <>
                        <TextField
                          label={i18next.t('Family name')}
                          placeholder={i18next.t('Family name')}
                          fieldPath={familyNameFieldPath}
                          required={this.isCreator()}
                          // forward ref to Input component because Form.Input
                          // doesn't handle it
                          input={{ ref: this.inputRef }}
                        />
                        <TextField
                          label={i18next.t('Given name(s)')}
                          placeholder={i18next.t('Given name')}
                          fieldPath={givenNameFieldPath}
                        />
                      </>
                    ) : (
                      <TextField
                        label={i18next.t('Name')}
                        placeholder={i18next.t('Organization name')}
                        fieldPath={nameFieldPath}
                        required={this.isCreator()}
                        // forward ref to Input component because Form.Input
                        // doesn't handle it
                        input={{ ref: this.inputRef }}
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
                  <AffiliationsField fieldPath={affiliationsFieldPath} />
                  <SelectField
                    fieldPath={roleFieldPath}
                    label={i18next.t('Role')}
                    options={this.props.roleOptions}
                    placeholder={i18next.t('Select role')}
                    {...(this.isCreator() && { clearable: true })}
                    required={!this.isCreator()}
                    optimized
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
                  content={i18next.t('Cancel')}
                  floated="left"
                />
                {this.props.action === ModalActions.ADD && (
                  <ActionButton
                    name="submit"
                    onClick={(event, formik) => {
                      this.setState({ action: 'saveAndContinue' }, () => {
                        formik.handleSubmit();
                        this.focusInput();
                      });
                    }}
                    primary
                    icon="checkmark"
                    content={this.state.saveAndContinueLabel}
                  />
                )}
                <ActionButton
                  name="submit"
                  onClick={(event, formik) => {
                    this.setState({ action: 'saveAndClose' }, () =>
                      formik.handleSubmit()
                    );
                  }}
                  primary
                  icon="checkmark"
                  content={i18next.t('Save')}
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
    affiliations: PropTypes.array,
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
