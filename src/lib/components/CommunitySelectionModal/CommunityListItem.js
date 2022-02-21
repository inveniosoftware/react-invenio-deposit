// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useContext } from 'react';
import { Item, Button, Container } from 'semantic-ui-react';
import _truncate from 'lodash/truncate';
import { Image } from 'react-invenio-forms';
import PropTypes from 'prop-types';
import { i18next } from '@translations/i18next';
import { CommunityContext } from './CommunityContext';

export const CommunityListItem = ({ result, standAlone }) => {
  const { setLocalCommunity, getChosenCommunity } = useContext(CommunityContext);

  const metadata = result.metadata;
  const linkToCommunityPage = result.links.self_html;

  const itemSelected = getChosenCommunity()?.id === result.id;

  return (
    <Item key={result.id} className="community-list-result-item">
      <Item.Image
        as={Image}
        size="tiny"
        src="/static/images/square-placeholder.png"
      />

      <Item.Content verticalAlign="top">
        <Item.Header
          as="a"
          href={linkToCommunityPage}
          target="_blank"
          rel="noreferrer"
        >
          {metadata.title}
        </Item.Header>
        <Item.Description>
          {_truncate(metadata.description, { length: 150 })}
        </Item.Description>
        <Item.Extra>{metadata.type}</Item.Extra>
      </Item.Content>

      <Container className="community-list-result-item-button-container" fluid>
        <SelectButton
          selected={itemSelected}
          standAlone={standAlone}
          onSelect={() => setLocalCommunity(itemSelected ? null : result)}
        />

        {standAlone && (
          <DeselectButton onDeselect={() => setLocalCommunity(null)} />
        )}
      </Container>
    </Item>
  );
};

CommunityListItem.propTypes = {
  result: PropTypes.object.isRequired,
  standAlone: PropTypes.bool,
};

CommunityListItem.defaultProps = {
  standAlone: false,
};

const SelectButton = ({ selected, standAlone, onSelect }) => {
  if (standAlone) return null;

  return (
    <Button
      content={selected ? i18next.t('selected') : i18next.t('select')}
      floated="right"
      positive={selected}
      onClick={() => onSelect()}
    />
  );
};

SelectButton.propTypes = {
  selected: PropTypes.bool.isRequired,
  standAlone: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const DeselectButton = ({ onDeselect }) => (
  <Button icon="delete" floated="right" onClick={() => onDeselect()} />
);

DeselectButton.propTypes = {
  onDeselect: PropTypes.func.isRequired,
};
