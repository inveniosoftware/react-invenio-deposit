// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';
import { Button, Form, Label, List, Icon } from 'semantic-ui-react';
import _get from 'lodash/get';
import { FieldLabel } from 'react-invenio-forms';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { CreatibutorsModal } from './CreatibutorsModal';
import { CreatibutorsFieldItem } from './CreatibutorsFieldItem';
import { CREATIBUTOR_TYPE } from './type';
import { i18next } from '@translations/i18next';
import { sortOptions } from '../../utils';

const creatibutorNameDisplay = (value) => {
  const creatibutorType = _get(
    value,
    'person_or_org.type',
    CREATIBUTOR_TYPE.PERSON
  );
  const isPerson = creatibutorType === CREATIBUTOR_TYPE.PERSON;

  const familyName = _get(value, 'person_or_org.family_name', '');
  const givenName = _get(value, 'person_or_org.given_name', '');
  const affiliationName = _get(value, `affiliations[0].name`, '');
  const name = _get(value, `person_or_org.name`);

  const affiliation = affiliationName ? ` (${affiliationName})` : '';

  if (isPerson) {
    const givenNameSuffix = givenName ? `, ${givenName}` : '';
    return `${familyName}${givenNameSuffix}${affiliation}`;
  }

  return `${name}${affiliation}`;
};

class CreatibutorsFieldForm extends Component {
  handleOnContributorChange = (selectedCreatibutor) => {
    const { push: formikArrayPush } = this.props;
    formikArrayPush(selectedCreatibutor);
  };

  render() {
    const {
      form: { values, errors, initialErrors, initialValues },
      remove: formikArrayRemove,
      replace: formikArrayReplace,
      move: formikArrayMove,
      name: fieldPath,
      label,
      labelIcon,
      roleOptions,
      schema,
      modal,
      autocompleteNames,
      addButtonLabel,
    } = this.props;

    const creatibutorsList = getIn(values, fieldPath, []);
    const formikInitialValues = getIn(initialValues, fieldPath, []);

    const error = getIn(errors, fieldPath, null);
    const initialError = getIn(initialErrors, fieldPath, null);
    const creatibutorsError =
      error || (creatibutorsList === formikInitialValues && initialError);

    return (
      <DndProvider backend={HTML5Backend}>
        <Form.Field
          required={schema === 'creators'}
          className={creatibutorsError ? 'error' : ''}
        >
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          <List>
            {creatibutorsList.map((value, index, array) => {
              const key = `${fieldPath}.${index}`;
              const identifiersError =
                creatibutorsError &&
                creatibutorsError[index]?.person_or_org?.identifiers;
              const displayName = creatibutorNameDisplay(value);

              return (
                <CreatibutorsFieldItem
                  key={key}
                  identifiersError={identifiersError}
                  {...{
                    displayName,
                    index,
                    roleOptions,
                    schema,
                    compKey: key,
                    initialCreatibutor: value,
                    removeCreatibutor: formikArrayRemove,
                    replaceCreatibutor: formikArrayReplace,
                    moveCreatibutor: formikArrayMove,
                    addLabel: modal.addLabel,
                    editLabel: modal.editLabel,
                    autocompleteNames: autocompleteNames,
                  }}
                />
              );
            })}
            <CreatibutorsModal
              onCreatibutorChange={this.handleOnContributorChange}
              action="add"
              addLabel={modal.addLabel}
              editLabel={modal.editLabel}
              roleOptions={sortOptions(roleOptions)}
              schema={schema}
              autocompleteNames={autocompleteNames}
              trigger={
                <Button type="button" icon labelPosition="left">
                  <Icon name="add" />
                  {addButtonLabel}
                </Button>
              }
            />
            {creatibutorsError && typeof creatibutorsError == 'string' && (
              <Label pointing="left" prompt>
                {creatibutorsError}
              </Label>
            )}
          </List>
        </Form.Field>
      </DndProvider>
    );
  }
}

export class CreatibutorsField extends Component {
  render() {
    return (
      <FieldArray
        name={this.props.fieldPath}
        component={(formikProps) => (
          <CreatibutorsFieldForm {...formikProps} {...this.props} />
        )}
      />
    );
  }
}

CreatibutorsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  addButtonLabel: PropTypes.string.isRequired,
  modal: PropTypes.shape({
    addLabel: PropTypes.string.isRequired,
    editLabel: PropTypes.string.isRequired,
  }).isRequired,
  schema: PropTypes.oneOf(['creators', 'contributors']).isRequired,
  autocompleteNames: PropTypes.oneOf(['search', 'search_only', 'off']),
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  roleOptions: PropTypes.array,
};

CreatibutorsField.defaultProps = {
  modal: {
    addLabel: i18next.t('Add creator'),
    editLabel: i18next.t('Edit creator'),
  },
  autocompleteNames: 'search',
  addButtonLabel: i18next.t('Add creator'),
};
