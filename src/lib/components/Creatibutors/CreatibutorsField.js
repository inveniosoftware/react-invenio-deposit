// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';
import { Button, Form, List, Icon } from 'semantic-ui-react';
import _get from 'lodash/get';
import { FieldLabel } from 'react-invenio-forms';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { CreatibutorsModal } from './CreatibutorsModal';
import { CreatibutorsFieldItem } from './CreatibutorsFieldItem';
import { CREATIBUTOR_TYPE } from './type';

const displayCreatibutorName = ({ familyName, givenName, affiliationName }) => {
  let displayName = familyName;
  if (givenName) {
    displayName += `, ${givenName}`;
  }
  if (affiliationName) {
    displayName += ` (${affiliationName})`;
  }
  return displayName;
};

class CreatibutorsFieldForm extends Component {
  sortOptions = (options) => {
    return options.sort((o1, o2) => o1.text.localeCompare(o2.text));
  };

  render() {
    const {
      form: { values, errors },
      remove: formikArrayRemove,
      replace: formikArrayReplace,
      move: formikArrayMove,
      push: formikArrayPush,
      name: fieldPath,
      label,
      labelIcon,
      roleOptions,
      schema,
    } = this.props;
    return (
      <DndProvider backend={HTML5Backend}>
        <Form.Field required={schema === 'creators'}>
          <FieldLabel
            htmlFor={fieldPath}
            icon={labelIcon}
            label={label}
          ></FieldLabel>
          <List>
            {getIn(values, fieldPath, []).map((value, index, array) => {
              const key = `${fieldPath}.${index}`;
              const personOrOrgPath = 'person_or_org';
              const typeFieldPath = `${personOrOrgPath}.type`;
              const familyNameFieldPath = `${personOrOrgPath}.family_name`;
              const givenNameFieldPath = `${personOrOrgPath}.given_name`;
              const nameFieldPath = `${personOrOrgPath}.name`;
              const affiliationsFieldPath = 'affiliations';
              // Default to person type
              const isPerson =
                _get(value, typeFieldPath, CREATIBUTOR_TYPE.PERSON) ===
                CREATIBUTOR_TYPE.PERSON;
              let displayName = isPerson
                ? displayCreatibutorName({
                    familyName: _get(
                      value,
                      familyNameFieldPath,
                      'No family name'
                    ),
                    givenName: _get(value, givenNameFieldPath, 'No given name'),
                    affiliationName: _get(
                      value,
                      `${affiliationsFieldPath}[0].name`
                    ),
                  })
                : displayCreatibutorName({
                    familyName: _get(
                      value,
                      nameFieldPath,
                      'No organization name'
                    ),
                    affiliationName: _get(
                      value,
                      `${affiliationsFieldPath}[0].name`
                    ),
                  });

              return (
                <CreatibutorsFieldItem
                  key={key}
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
                    addLabel: this.props.modal.addLabel,
                    editLabel: this.props.modal.editLabel,
                  }}
                />
              );
            })}
            <CreatibutorsModal
              onCreatibutorChange={(selectedCreatibutor) => {
                formikArrayPush(selectedCreatibutor);
              }}
              action="add"
              addLabel={this.props.modal.addLabel}
              editLabel={this.props.modal.editLabel}
              roleOptions={roleOptions}
              schema={schema}
              trigger={
                <Button type="button">
                  <Icon name="add" />
                  {this.props.addButtonLabel}
                </Button>
              }
            />
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
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  roleOptions: PropTypes.array,
};

CreatibutorsField.defaultProps = {
  modal: {
    addLabel: 'Add creator',
    editLabel: 'Edit creator',
  },
  addButtonLabel: 'Add creator',
};
