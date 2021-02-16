// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { Button, Checkbox, Divider, Icon, List, Message } from 'semantic-ui-react';
import {
  FieldLabel,
  TextAreaField,
  TextField,
} from 'react-invenio-forms';

import { Embargo, EmbargoState } from './Embargo';
import { FastField, Field } from 'formik';


class ProtectionButtonsComponent extends Component {
  /**
   * Returns the props for a protection button.
   * @param active is button active
   * @param activeColor button color when active
   */
  getButtonProps(active, activeColor) {
    let props = {active};
    if (active) {
      props["color"] = activeColor;
    }
    return props;
  }

  render() {
    const {
      formik,
      active,
    } = this.props;

    return (
      <Button.Group widths={'2'}>
        <Button
          {...this.getButtonProps(active, "green")}
          onClick={(event, data) => {
            formik.form.setFieldValue(formik.field.name, "public");
            // NOTE: We reset values, so if embargo filled and click Public,
            //       user needs to fill embargo again. Otherwise lots of
            //       bookkeeping.
            formik.form.setFieldValue("access.embargo", {
              active: false
            });
          }}
          compact
          attached
        >
          Public
        </Button>
        <Button
          {...this.getButtonProps(!active, "red")}
          onClick={(event, data) => formik.form.setFieldValue(formik.field.name, "restricted")}
          compact
          attached
        >
          Restricted
        </Button>

      </Button.Group>
    );
  }
}


export class ProtectionButtons extends Component {
  render() {
    const {
      fieldPath,
      ...props
    } = this.props;

    return <FastField
      name={fieldPath}
      component={(formikProps) => (
        <ProtectionButtonsComponent formik={formikProps} {...props} />
      )}
    />;
  }
}


export function MetadataSection({isPublic}) {
  return (
    <>
      <p>Full record</p>
      <ProtectionButtons active={isPublic} fieldPath="access.record" />
    </>
  );
}


export function filesButtons(filesPublic) {
  return (
    <ProtectionButtons active={filesPublic} fieldPath="access.files" />
  );
}


export function filesSection(filesStyle, filesContent) {
  return (
    <>
      <p style={filesStyle}>Files only</p>
      {filesContent}
    </>
  );
}


export function MessageSection({intent, icon, title, text}) {
  return (
    <Message visible {...intent}>
      <Message.Header>
        <Icon name={icon} /> {title}
      </Message.Header>
      {/* Needed to override semantic-ui's Card styling */}
      <p style={{marginTop: "0.25em"}}>{text}</p>
    </Message>
  )
}


class EmbargoCheckboxComponent extends Component {

  render() {
    const {
      formik,
      embargo
    } = this.props;

    return <Checkbox
      disabled={embargo.is(EmbargoState.DISABLED)}
      checked={embargo.is(EmbargoState.APPLIED)}
      onChange={
        (event, data) => {
          if (formik.field.value) {
            // NOTE: We reset values, so if embargo filled and user unchecks,
            //       user needs to fill embargo again. Otherwise lots of
            //       bookkeeping.
            formik.form.setFieldValue("access.embargo", {
              active: false
            });
          } else {
            formik.form.setFieldValue("access.embargo.active", true);
          }
        }
      }
    />;
  }
}

class EmbargoCheckbox extends Component {
  render() {
    const {
      fieldPath,
      embargo
    } = this.props;

    // NOTE: Can't be a FastField bc relies on `embargo` changing which is
    //       different than `access.embargo.active`
    // TODO: find way to make it a FastField
    return <Field
      name={fieldPath}
      component={
        (formikProps) => (
          <EmbargoCheckboxComponent formik={formikProps} embargo={embargo} />
        )
      }
    />;
  }
}


export function EmbargoDateField({ fieldPath, label, labelIcon, placeholder, required }) {
  return (
    <TextField
      fieldPath={fieldPath}
      label={
        <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
      }
      placeholder={placeholder}
      required={required}
    />
  );
}

EmbargoDateField.defaultProps = {
  fieldPath: 'access.embargo.until',
  label: 'Embargo until',
  labelIcon: 'calendar',
  placeholder: 'YYYY-MM-DD',
};


export function embargoSection(embargo) {
  const greyedStyle = {
    opacity: "0.5",
    cursor: "default !important"
  }
  const embargoStyle = embargo.is(EmbargoState.DISABLED) ? greyedStyle : {};
  const fmtDate = (
    embargo.date
    ? DateTime.fromISO(embargo.date)
      .toLocaleString(DateTime.DATE_FULL) // e.g. June 21, 2021
    : "???"
  );

  return (
    <List>
      <List.Item>
        <List.Icon>
          <EmbargoCheckbox
            fieldPath="access.embargo.active"
            embargo={embargo}
          />
        </List.Icon>
        <List.Content>
          <List.Header style={embargoStyle}>Apply an embargo</List.Header>
          <List.Description style={greyedStyle}>Record or files protection must be <b>restricted</b> to apply an embargo.</List.Description>
          {embargo.is(EmbargoState.APPLIED) && (
            <>
              <Divider hidden />
              <EmbargoDateField required />
              <TextAreaField label="Embargo reason" fieldPath={"access.embargo.reason"} placeholder="Describe the reason for the embargo." />
            </>
          )}
          {embargo.is(EmbargoState.LIFTED) && (
            <>
              <Divider hidden />
              <p>Embargo was lifted on {fmtDate}.</p>
              <p><b>Reason</b>: {embargo.reason}.</p>
            </>
          )}
        </List.Content>
      </List.Item>
    </List>
  );
}
