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

import { Embargo } from './Embargo';

/**
 * Returns the props for a protection button.
 * @param active is button active
 * @param activeColor button color when active
 */
export function getProtectionButtonProps(active, activeColor) {
  let props = {active};
  if (active) {
    props["color"] = activeColor;
  }
  return props;
}


function ProtectionButtons({active}) {
  return (
    <Button.Group widths={'2'}>
      <Button {...getProtectionButtonProps(active, "green")} compact attached>Public</Button>
      <Button {...getProtectionButtonProps(!active, "red")} compact attached>Restricted</Button>
    </Button.Group>
  );
}

export function metadataSection(metadataPublic) {
  return (
    <>
      <p>Full record</p>
      <ProtectionButtons active={metadataPublic} />
    </>
  );
}


export function filesButtons(filesPublic) {
  return (
    <ProtectionButtons active={filesPublic} />
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


export function messageSection(intent, icon, title, text) {
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


class EmbargoDateField extends Component {
  render() {
    const { fieldPath, label, labelIcon, placeholder, required } = this.props;

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
}

EmbargoDateField.defaultProps = {
  fieldPath: 'access.embargo_date',
  label: 'Embargo until',
  labelIcon: 'calendar',
  placeholder: 'YYYY-MM-DD',
};


export function embargoSection(embargo) {
  const greyedStyle = {
    opacity: "0.5",
    cursor: "default !important"
  }
  const disabled = embargo.is(Embargo.DISABLED) || embargo.is(Embargo.LIFTED);
  const embargoStyle = disabled ? greyedStyle : {};
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
          <Checkbox
            disabled={disabled}
            checked={embargo.is(Embargo.APPLIED)} />
        </List.Icon>
        <List.Content>
          <List.Header style={embargoStyle}>Apply an embargo</List.Header>
          <List.Description style={greyedStyle}>Record or files protection must be <b>restricted</b> to apply an embargo.</List.Description>
          {embargo.is(Embargo.APPLIED) && (
            <>
              <Divider hidden />
              <EmbargoDateField required />
              <TextAreaField label="Embargo reason" fieldPath={"access" + ".reason"} placeholder="Describe the reason for the embargo." />
            </>
          )}
          {embargo.is(Embargo.LIFTED) && (
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
