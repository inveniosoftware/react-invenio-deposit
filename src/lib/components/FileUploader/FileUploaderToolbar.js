// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';
import { Checkbox, Grid, Icon, Label, List, Popup } from 'semantic-ui-react';
import { humanReadableBytes } from './utils';

export const FileUploaderToolbar = ({
  onMetadataOnlyClick,
  quota,
  filesList,
  filesSize,
  filesEnabled,
  config,
  ...props
}) => {
  return (
    <>
      <Grid.Column width={8} verticalAlign="middle" floated="left">
        {config.canHaveMetadataOnlyRecords && (
          <List horizontal>
            <List.Item>
              <Checkbox
                label={'Metadata only record'}
                onClick={onMetadataOnlyClick}
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
      <Grid.Column width={8} floated="right">
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
    </>
  );
};
