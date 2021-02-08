// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';
import { useFormikContext } from 'formik';
import { Checkbox, Grid, Icon, Label, List, Popup } from 'semantic-ui-react';
import { humanReadableBytes } from './utils';

// NOTE: This component has to be a function component to allow
//       the `useFormikContext` hook.
export const FileUploaderToolbar = ({
  config,
  filesList,
  filesSize,
  filesEnabled,
  quota,
  setFilesEnabled,
}) => {
  // We extract the working copy of the draft stored as `values` in formik
  const { values: formikDraft } = useFormikContext();

  return (
    <>
      <Grid.Column verticalAlign="middle" floated="left" width={6}>
        {config.canHaveMetadataOnlyRecords && (
          <List horizontal>
            <List.Item>
              <Checkbox
                label={'Metadata-only record'}
                onClick={(event, data) => {
                  if (!data['disabled']) {
                    // if checkbox is not disabled
                    setFilesEnabled(formikDraft, !filesEnabled);
                  }
                }}
                disabled={filesList.length > 0}
                checked={!filesEnabled}
              />
            </List.Item>
            <List.Item style={{ marginLeft: '5px' }}>
              <Popup
                trigger={
                  <Icon name="question circle outline" color="grey"></Icon>
                }
                content="Disable files for this record"
                position="top center"
              />
            </List.Item>
          </List>
        )}
      </Grid.Column>
      {filesEnabled && (
        <Grid.Column width={10}>
          <List horizontal floated="right">
            <List.Item>Storage available</List.Item>
            <List.Item>
              <Label
                {...(filesList.length === quota.maxFiles
                  ? { color: 'blue' }
                  : {})}
              >
                {filesList.length} out of {quota.maxFiles} files
              </Label>
            </List.Item>
            <List.Item>
              <Label
                {...(humanReadableBytes(filesSize) ===
                humanReadableBytes(quota.maxStorage)
                  ? { color: 'blue' }
                  : {})}
              >
                {humanReadableBytes(filesSize)} out of{' '}
                {humanReadableBytes(quota.maxStorage)}
              </Label>
            </List.Item>
          </List>
        </Grid.Column>
      )}
    </>
  );
};
