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
  return (
    <DndProvider backend={HTML5Backend}>
      <Form.Field required={required}>
        <FieldLabel
          htmlFor={fieldPath}
          icon={labelIcon}
          label={label}
        ></FieldLabel>
        <List>
          {/* TODO don't get values from field path actually? Unless added items go there */}
          {getIn(values, fieldPath, []).map((value, index, array) => {
            const serializedAward = serializeAward(value.award);
            const arrayPath = fieldPath;
            const indexPath = index;
            const key = `${arrayPath}.${indexPath}`;
            // if award has no id, it's a custom one
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
                }}
              />
            );
          })}
          <FundingModal
            searchConfig={props.searchConfig}
            trigger={
              <Button>
                <Icon name="add" />
                {i18next.t('Add award')}
              </Button>
            }
            onAwardChange={(selectedAward) => {
              formikArrayPush(selectedAward);
            }}
            mode="standard"
            action="add"
            serializeAward = {props.serializeAward}            
            computeFundingContents = {props.computeFundingContents}
          />
          <FundingModal
            searchConfig={props.searchConfig}
            trigger={
              <Button>
                <Icon name="add" />
                {i18next.t('Add custom')}
              </Button>
            }
            onAwardChange={(selectedAward) => {
              formikArrayPush(selectedAward);
            }}
            mode="custom"
            action="add"
            serializeAward = {props.serializeAward}
            computeFundingContents= {props.computeFundingContents}
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
  serializeAward: PropTypes.func,
  computeFundingContents: PropTypes.func
};

FundingField.defaultProps = {
  fieldPath: 'metadata.funding',
  label: 'Awards',
  labelIcon: 'money bill alternate outline',
  required: false,
};
