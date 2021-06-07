// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';
import _isEmpty from 'lodash/isEmpty';

import { DateTime } from 'luxon';
import { Divider, Icon, List, Message } from 'semantic-ui-react';
import { TextAreaField } from 'react-invenio-forms';

import { EmbargoState } from './Embargo';
import { ProtectionButtons } from './ProtectionButtons';
import { EmbargoCheckboxField } from './EmbargoCheckboxField';
import { EmbargoDateField } from './EmbargoDateField';

export function MetadataSection({ isPublic }) {
  return (
    <>
      <p>Full record</p>
      <ProtectionButtons active={isPublic} fieldPath="access.record" />
    </>
  );
}

export function filesButtons(filesPublic) {
  return <ProtectionButtons active={filesPublic} fieldPath="access.files" />;
}

export function filesSection(filesStyle, filesContent) {
  return (
    <>
      <p style={filesStyle}>Files only</p>
      {filesContent}
    </>
  );
}

export function MessageSection({ intent, icon, title, text }) {
  return (
    <Message visible {...intent}>
      <strong>
        <Icon name={icon} /> {title}
      </strong>
      {/* Needed to override semantic-ui's Card styling */}
      <p style={{ marginTop: '0.25em' }}>{text}</p>
    </Message>
  );
}

export function embargoSection(initialAccessValues, embargo) {
  const fmtDate = initialAccessValues.embargo?.until
    ? DateTime.fromISO(initialAccessValues.embargo?.until).toLocaleString(
        DateTime.DATE_FULL
      ) // e.g. June 21, 2021
    : '???';
  const embargoWasLifted =
    !initialAccessValues.embargo?.active &&
    !_isEmpty(initialAccessValues.embargo?.until);

  return (
    <List>
      <List.Item>
        <List.Icon>
          <EmbargoCheckboxField
            fieldPath="access.embargo.active"
            embargo={embargo}
          />
        </List.Icon>
        <List.Content>
          <List.Header>
            <label
              className={embargo.is(EmbargoState.DISABLED) ? 'disabled' : ''}
              htmlFor={'access.embargo.active'}
            >
              Apply an embargo <Icon name="clock outline" />
            </label>
          </List.Header>
          <List.Description className={'disabled'}>
            Record or files protection must be <b>restricted</b> to apply an
            embargo.
          </List.Description>
          {embargo.is(EmbargoState.APPLIED) && (
            <>
              <Divider hidden />
              <EmbargoDateField fieldPath="access.embargo.until" required />
              <TextAreaField
                label="Embargo reason"
                fieldPath={'access.embargo.reason'}
                placeholder="Optionally, describe the reason for the embargo."
                optimized
              />
            </>
          )}
          {embargoWasLifted && (
            <>
              <Divider hidden />
              <p>Embargo was lifted on {fmtDate}.</p>
              {initialAccessValues.embargo.reason && (
                <p>
                  <b>Reason</b>: {initialAccessValues.embargo.reason}.
                </p>
              )}
            </>
          )}
        </List.Content>
      </List.Item>
    </List>
  );
}
