// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import i18next from 'i18next';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button, Label, List, Ref } from 'semantic-ui-react';

import { FundingModal } from './FundingModal';

export const FundingFieldItem = ({
  compKey,
  index,
  award,
  awardType,
  moveAward,
  replaceAward,
  removeAward,
  searchConfig,
  serializeAward,
  computeFundingContents
}) => {
  const dropRef = React.useRef(null);
  const [_, drag, preview] = useDrag({
    item: { index, type: 'award' },
  });
  const [{ hidden }, drop] = useDrop({
    accept: 'award',
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
        moveAward(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      hidden: monitor.isOver({ shallow: true }),
    }),
  });

  let {headerContent, descriptionContent} = computeFundingContents(award);

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
          <FundingModal
            searchConfig={searchConfig}
            onAwardChange={(selectedAward) => {
              replaceAward(index, selectedAward);
            }}
            mode={awardType}
            action="edit"
            trigger={
              <Button size="mini" primary type="button">
                Edit
              </Button>
            }
            serializeAward={serializeAward}
            computeFundingContents={computeFundingContents}
          />
          <Button size="mini" type="button" onClick={() => removeAward(index)}>
            Remove
          </Button>
        </List.Content>

        {/* TODO in case of empty results, this gets rendered as an empty bar */}
        <Ref innerRef={drag}>
          <List.Icon name="bars" className="drag-anchor" />
        </Ref>
        <Ref innerRef={preview}>
          <List.Content>
            <List.Header>
              {(
                <span>
                  {headerContent}
                  {/* TODO what if award does not have title? We're using funder for header content. IN that case, award number should not be displayed */}
                  {award.number && (
                    <Label basic size="mini">
                      {award.number}
                    </Label>
                  )}
                </span>
              )}
            </List.Header>
            <List.Description>{descriptionContent}</List.Description>
          </List.Content>
        </Ref>
      </List.Item>
    </Ref>
  );
};
