// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { Button, List, Ref } from 'semantic-ui-react';
import { useDrag, useDrop } from 'react-dnd';

import { CreatibutorsModal } from './CreatibutorsModal';

export const CreatibutorsFieldItem = ({
  compKey,
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

  // Initialize the ref explicitely
  drop(dropRef);
  return (
    <Ref innerRef={dropRef} key={compKey}>
      <List.Item
        key={compKey}
        className={
          hidden ? 'creatibutor-listitem hidden' : 'creatibutor-listitem'
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
            action="edit"
            trigger={
              <Button size="mini" primary type="button">
                Edit
              </Button>
            }
          />
          <Button
            size="mini"
            type="button"
            onClick={() => removeCreatibutor(index)}
          >
            Remove
          </Button>
        </List.Content>
        <Ref innerRef={drag}>
          <List.Icon name="bars" style={{ cursor: 'move' }} />
        </Ref>
        <Ref innerRef={preview}>
          <List.Content>
            <List.Description>{displayName}</List.Description>
          </List.Content>
        </Ref>
      </List.Item>
    </Ref>
  );
};
