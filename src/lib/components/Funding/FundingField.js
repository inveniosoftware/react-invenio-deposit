// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray, getIn } from 'formik';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Button, Form, Icon, List } from 'semantic-ui-react';
import { FieldLabel } from 'react-invenio-forms';

import { FundingFieldItem } from './FundingFieldItem';
import { FundingModal } from './FundingModal';

import { i18next } from '@translations/i18next';

function FundingFieldForm(props) {
  const {
    label,
    labelIcon,
    fieldPath,
    form: { values, errors },
    move: formikArrayMove,
    push: formikArrayPush,
    remove: formikArrayRemove,
    replace: formikArrayReplace,
    required,
  } = props;

<<<<<<< HEAD
  const deserializeAward = props.deserializeAward
  ? props.deserializeAward
  : (award) => ({
    title: award?.title?.en ?? award.title, // TODO deserialize properly
    pid: award.pid,
    number: award.number,
    funder: award.funder ?? '' // TODO funder is optional
  });

  const deserializeFunder = props.deserializeFunder
  ? props.deserializeFunder
  : (funder) => ({
    id: funder.id,
    pid: funder.pid,
    name: funder.name
  });

  const computeFundingContents = props.computeFundingContents 
  ? props.computeFundingContents
  :(funding) => {

    let headerContent, descriptionContent = '';
    let awardOrFunder = 'award';
    if (funding.award) {
      headerContent = funding.award.title;
    }

    if (funding.funder) {
      const funderName = funding?.funder?.name ?? funding.funder?.title?.en ?? funding?.funder?.id ?? '';
      descriptionContent = funderName;
      if (!headerContent) {
        awardOrFunder = 'funder';
        headerContent = funderName;
        descriptionContent = '';
      }
    }

    return { headerContent, descriptionContent, awardOrFunder };
  };
=======
  const computeFundingContents = props.computeFundingContents 
  ? props.computeFundingContents
  :(award) => {
    const awardTitle = award.title;
    const funderName = award?.funder?.name ?? award.funder.title.en ?? award?.funder?.id ?? '';

    const headerContent = awardTitle ?? funderName;
    const descriptionContent = headerContent === awardTitle ? funderName : '';
    return { headerContent, descriptionContent };
  };

  const serializeAward = props.serializeAward
  ? props.serializeAward
  : (award) => ({
    title: award.title.en ?? award.title, // TODO deserialize properly
    pid: award.pid,
    number: award.number,
    funder: award.funder ?? ''
  });
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
  return (
    <DndProvider backend={HTML5Backend}>
      <Form.Field required={required}>
        <FieldLabel
          htmlFor={fieldPath}
          icon={labelIcon}
          label={label}
        ></FieldLabel>
        <List>
<<<<<<< HEAD
          {getIn(values, fieldPath, []).map((value, index, array) => {
            console.log('Iterating value ');
            console.log(value);
=======
          {/* TODO don't get values from field path actually? Unless added items go there */}
          {getIn(values, fieldPath, []).map((value, index, array) => {
            const serializedAward = serializeAward(value.award);
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
            const arrayPath = fieldPath;
            const indexPath = index;
            const key = `${arrayPath}.${indexPath}`;
            // if award has no id, it's a custom one
<<<<<<< HEAD
            const awardType = value.award.pid ? 'standard' : 'custom';
            return (
              <FundingFieldItem
                key={key}
                {...{
                  index,
                  compKey: key,
                  fundingItem: value,
                  awardType,
                  moveFunding: formikArrayMove,
                  replaceFunding: formikArrayReplace,
                  removeFunding: formikArrayRemove,
                  searchConfig: props.searchConfig,
                  computeFundingContents: computeFundingContents,
                  deserializeAward: deserializeAward,
                  deserializeFunder: deserializeFunder
=======
            const awardType = serializedAward.pid ? 'standard' : 'custom';
            return (
              <FundingFieldItem
                key={key} // TODO key overlaps?
                {...{
                  index,
                  compKey: key, // TODO key overlaps?
                  award: serializedAward,
                  awardType,
                  moveAward: formikArrayMove,
                  replaceAward: formikArrayReplace,
                  removeAward: formikArrayRemove,
                  searchConfig: props.searchConfig,
                  computeFundingContents: computeFundingContents,
                  serializeAward: props.serializeAward
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
                }}
              />
            );
          })}
          <FundingModal
            searchConfig={props.searchConfig}
            trigger={
<<<<<<< HEAD
              <Button type="button" key="custom" icon labelPosition="left">
=======
              <Button>
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
                <Icon name="add" />
                {i18next.t('Add award')}
              </Button>
            }
<<<<<<< HEAD
            onAwardChange={(selectedFunding) => {
              console.log('Add award on award change');
              formikArrayPush(selectedFunding);
            }}
            mode="standard"
            action="add"
            deserializeAward={deserializeAward}      
            deserializeFunder={deserializeFunder}      
            computeFundingContents={computeFundingContents}
=======
            onAwardChange={(selectedAward) => {
              formikArrayPush(selectedAward);
            }}
            mode="standard"
            action="add"
            serializeAward = {props.serializeAward}            
            computeFundingContents = {props.computeFundingContents}
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
          />
          <FundingModal
            searchConfig={props.searchConfig}
            trigger={
<<<<<<< HEAD
              <Button type="button" key="custom" icon labelPosition="left">
=======
              <Button>
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
                <Icon name="add" />
                {i18next.t('Add custom')}
              </Button>
            }
<<<<<<< HEAD
            onAwardChange={(selectedFunding) => {
              console.log('Add custom award on award change');
              formikArrayPush(selectedFunding);
            }}
            mode="custom"
            action="add"
            deserializeAward={deserializeAward}
            deserializeFunder={deserializeFunder}      
            computeFundingContents={computeFundingContents}
=======
            onAwardChange={(selectedAward) => {
              formikArrayPush(selectedAward);
            }}
            mode="custom"
            action="add"
            serializeAward = {props.serializeAward}
            computeFundingContents= {props.computeFundingContents}
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
          />
        </List>
      </Form.Field>
    </DndProvider>
  );
}

export function FundingField(props) {
  return (
    <FieldArray
      name={props.fieldPath}
      component={(formikProps) => (
        <FundingFieldForm {...formikProps} {...props} />
      )}
    />
  );
}

FundingField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  searchConfig: PropTypes.object.isRequired,
  required: PropTypes.bool,
<<<<<<< HEAD
  deserializeAward: PropTypes.func,
  deserializeFunder: PropTypes.func,
=======
  serializeAward: PropTypes.func,
>>>>>>> 8c2829bcddcec067d46f8119bbe4ebaa494803b3
  computeFundingContents: PropTypes.func
};

FundingField.defaultProps = {
  fieldPath: 'metadata.funding',
  label: 'Awards',
  labelIcon: 'money bill alternate outline',
  required: false,
};
