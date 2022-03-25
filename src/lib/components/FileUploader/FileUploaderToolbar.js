// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import { useFormikContext } from 'formik';
import React from 'react';
import { Checkbox, Grid, Icon, Label, List, Popup } from 'semantic-ui-react';
import { humanReadableBytes } from './utils';
import { i18next } from '@translations/i18next';

// NOTE: This component has to be a function component to allow
//       the `useFormikContext` hook.
export const FileUploaderToolbar = ({
  config,
  filesList,
  filesSize,
  filesEnabled,
  quota,
}) => {
  const { setFieldValue } = useFormikContext();

  return (
    <>
      <Grid.Column verticalAlign="middle" floated="left" width={6}>
        {config.canHaveMetadataOnlyRecords && (
          <List horizontal>
            <List.Item>
              <Checkbox
                label={i18next.t('Metadata-only record')}
                onChange={() => setFieldValue('files.enabled', !filesEnabled)}
                disabled={filesList.length > 0}
                checked={!filesEnabled}
              />
            </List.Item>
            <List.Item>
              <Popup
                trigger={
                  <Icon name="question circle outline" color="grey"/>
                }
                content={i18next.t('Disable files for this record')}
                position="top center"
              />
            </List.Item>
          </List>
        )}
      </Grid.Column>
      {filesEnabled && (
        <Grid.Column width={10}>
          <List horizontal floated="right">
            <List.Item>{i18next.t('Storage available')}</List.Item>
            <List.Item>
              <Label
                {...(filesList.length === quota.maxFiles
                  ? { color: 'blue' }
                  : {})}
              >
                {i18next.t(`{{length}} out of {{maxfiles}} files`, {
                  length: filesList.length,
                  maxfiles: quota.maxFiles,
                })}
              </Label>
            </List.Item>
            <List.Item>
              <Label
                {...(humanReadableBytes(filesSize) ===
                humanReadableBytes(quota.maxStorage)
                  ? { color: 'blue' }
                  : {})}
              >
                {humanReadableBytes(filesSize)} {i18next.t('out of')}{' '}
                {humanReadableBytes(quota.maxStorage)}
              </Label>
            </List.Item>
          </List>
        </Grid.Column>
      )}
    </>
  );
};
