// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button, List, Ref } from 'semantic-ui-react';
import _truncate from 'lodash/truncate';
import { LicenseModal } from './LicenseModal';
import { i18next } from '@translations/i18next';

export const LicenseFieldItem = ({
  compKey,
  index,
  initialLicense,
  licenseDescription,
  licenseTitle,
  licenseType,
  moveLicense,
  replaceLicense,
  removeLicense,
  searchConfig,
  serializeLicenses,
  link,
}) => {
  const dropRef = React.useRef(null);
  const [_, drag, preview] = useDrag({
    item: { index, type: 'license' },
  });
  const [{ hidden }, drop] = useDrop({
    accept: 'license',
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      if (monitor.isOver({ shallow: true })) {
        moveLicense(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      hidden: monitor.isOver({ shallow: true }),
    }),
  });

  // Initialize the ref explicitely
  drop(dropRef);
  return (
    <Ref innerRef={dropRef} key={compKey}>
      <List.Item
        key={compKey}
        className={
          hidden ? 'deposit-drag-listitem hidden' : 'deposit-drag-listitem'
        }
      >
        <List.Content floated="right">
          <LicenseModal
            searchConfig={searchConfig}
            onLicenseChange={(selectedLicense) => {
              replaceLicense(index, selectedLicense);
            }}
            mode={licenseType}
            initialLicense={initialLicense}
            action="edit"
            trigger={
              <Button size="mini" primary type="button">
                {i18next.t('Edit')}
              </Button>
            }
            serializeLicenses={serializeLicenses}
          />
          <Button
            size="mini"
            type="button"
            onClick={() => removeLicense(index)}
          >
            {i18next.t('Remove')}
          </Button>
        </List.Content>
        <Ref innerRef={drag}>
          <List.Icon name="bars" className="drag-anchor" />
        </Ref>
        <Ref innerRef={preview}>
          <List.Content>
            <List.Header>{licenseTitle}</List.Header>
            {licenseDescription && (
              <List.Description>
                {_truncate(licenseDescription, { length: 300 })}
              </List.Description>
            )}
            {link && (
              <span>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {licenseDescription && <span>&nbsp;</span>}
                  {i18next.t('Read more')}
                </a>
              </span>
            )}
          </List.Content>
        </Ref>
      </List.Item>
    </Ref>
  );
};
