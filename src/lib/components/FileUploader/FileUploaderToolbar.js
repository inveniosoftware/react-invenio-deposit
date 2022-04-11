// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C)      2021 Graz University of Technology.
// Copyright (C)      2022 TU Wien.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import { useFormikContext } from 'formik';
import React from 'react';
import { Header, Checkbox, Grid, Icon, Label, List, Popup } from 'semantic-ui-react';
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
  decimalSizeDisplay,
}) => {
  const { setFieldValue } = useFormikContext();

  return (
    <>
      <Grid.Column verticalAlign="middle" floated="left" mobile={16} tablet={6} computer={6}>
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
                trigger={<Icon name="question circle outline" color="grey" />}
                content={i18next.t('Disable files for this record')}
                position="top center"
              />
            </List.Item>
          </List>
        )}
      </Grid.Column>
      {filesEnabled && (
        <Grid.Column mobile={16} tablet={10} computer={10} className="storage-col">
          <Header size="tiny" className="mr-10">{i18next.t('Storage available')}</Header>
          <List horizontal floated="right">
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
                {...(humanReadableBytes(filesSize, decimalSizeDisplay) ===
                humanReadableBytes(quota.maxStorage, decimalSizeDisplay)
                  ? { color: 'blue' }
                  : {})}
              >
                {humanReadableBytes(filesSize, decimalSizeDisplay)}{' '}
                {i18next.t('out of')}{' '}
                {humanReadableBytes(quota.maxStorage, decimalSizeDisplay)}
              </Label>
            </List.Item>
          </List>
        </Grid.Column>
      )}
    </>
  );
};
