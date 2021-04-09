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

  return (
    <DndProvider backend={HTML5Backend}>
      <Form.Field required={required}>
        <FieldLabel
          htmlFor={fieldPath}
          icon={labelIcon}
          label={label}
        ></FieldLabel>
        <List>
          {getIn(values, fieldPath, []).map((value, index, array) => {
            const arrayPath = fieldPath;
            const indexPath = index;
            const key = `${arrayPath}.${indexPath}`;
            const awardTitle = value.award?.title;
            const funderName = value.funder?.name;
            //TODO: how do we know if it's custom or standard?
            const awardType = value.award?.id ? 'standard' : 'custom';
            return (
              <FundingFieldItem
                key={key}
                {...{
                  index,
                  compKey: key,
                  initialAward: awardType === 'custom' ? value : null,
                  awardTitle,
                  funderName,
                  awardType,
                  moveAward: formikArrayMove,
                  replaceAward: formikArrayReplace,
                  removeAward: formikArrayRemove,
                  searchConfig: props.searchConfig,
                  serializeAwards: props.serializeAwards,
                }}
              />
            );
          })}
          <FundingModal
            searchConfig={props.searchConfig}
            trigger={
              <Button>
                <Icon name="add" />
                Add award
              </Button>
            }
            onAwardChange={(selectedAward) => {
              formikArrayPush(selectedAward);
            }}
            mode="standard"
            action="add"
            // serializeAwards={props.serializeAwards}
          />
          <FundingModal
            searchConfig={props.searchConfig}
            trigger={
              <Button>
                <Icon name="add" />
                Add missing
              </Button>
            }
            onAwardChange={(selectedAward) => {
              formikArrayPush(selectedAward);
            }}
            mode="custom"
            action="add"
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
  // searchConfig: PropTypes.object.isRequired, //TODO: Proper backend endpoint
  required: PropTypes.bool,
  serializeAwards: PropTypes.func,
};

FundingField.defaultProps = {
  fieldPath: 'metadata.funding',
  label: 'Awards',
  labelIcon: 'money bill alternate outline',
  required: false,
};
