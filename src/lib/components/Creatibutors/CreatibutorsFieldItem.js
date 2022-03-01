// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 New York University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button, Label, List, Ref } from 'semantic-ui-react';
import _get from 'lodash/get';
import { i18next } from '@translations/i18next';
import { CreatibutorsModal } from './CreatibutorsModal';

export const CreatibutorsFieldItem = ({
  compKey,
  identifiersError,
  index,
  replaceCreatibutor,
  removeCreatibutor,
  moveCreatibutor,
  addLabel,
  editLabel,
  initialCreatibutor,
  displayName,
  roleOptions,
  schema,
  autocompleteNames,
}) => {
  const dropRef = React.useRef(null);
  const [_, drag, preview] = useDrag({
    item: { index, type: 'creatibutor' },
  });
  const [{ hidden }, drop] = useDrop({
    accept: 'creatibutor',
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
        moveCreatibutor(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      hidden: monitor.isOver({ shallow: true }),
    }),
  });

  const renderRole = (role, roleOptions) => {
    if (role) {
      const friendlyRole =
        roleOptions.find(({ value }) => value === role)?.text ?? role;

      return <Label size="tiny">{friendlyRole}</Label>;
    }
  };
  const firstError =
    identifiersError &&
    identifiersError.find((elem) => ![undefined, null].includes(elem));

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
          <CreatibutorsModal
            addLabel={addLabel}
            editLabel={editLabel}
            onCreatibutorChange={(selectedCreatibutor) => {
              replaceCreatibutor(index, selectedCreatibutor);
            }}
            initialCreatibutor={initialCreatibutor}
            roleOptions={roleOptions}
            schema={schema}
            autocompleteNames={autocompleteNames}
            action="edit"
            trigger={
              <Button size="mini" primary type="button">
                {i18next.t('Edit')}
              </Button>
            }
          />
          <Button
            size="mini"
            type="button"
            onClick={() => removeCreatibutor(index)}
          >
            {i18next.t('Remove')}
          </Button>
        </List.Content>
        <Ref innerRef={drag}>
          <List.Icon name="bars" className="drag-anchor" />
        </Ref>
        <Ref innerRef={preview}>
          <List.Content>
            <List.Description>
              <span class="creatibutor">
              {_get(initialCreatibutor, 'person_or_org.identifiers', []).some(
                (identifier) => identifier.scheme === 'orcid'
              ) && (
                <img alt="ORCID logo" className="inline-id-icon" src="/static/images/orcid.svg" width="16" height="16" />
              )}
              {displayName} {renderRole(initialCreatibutor?.role, roleOptions)}
              </span>
            </List.Description>
            {firstError && (
              <Label pointing="left" prompt>
                {firstError.scheme ? firstError.scheme : 'Invalid identifiers'}
              </Label>
            )}
          </List.Content>
        </Ref>
      </List.Item>
    </Ref>
  );
};
