// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useContext } from 'react';
import { Item, Button } from 'semantic-ui-react';
import _truncate from 'lodash/truncate';
import { Image } from 'react-invenio-forms';
import PropTypes from 'prop-types';
import { i18next } from '@translations/i18next';
import { CommunityContext } from './CommunityContext';

export const CommunityListItem = ({ result, standAlone }) => {
  const { setLocalCommunity, getChosenCommunity } =
    useContext(CommunityContext);

  const { metadata } = result;
  const linkToCommunityPage = result.links.self_html;

  const itemSelected = getChosenCommunity()?.uuid === result.uuid;

  return (
    <Item key={result.id} className="pr-20">
      <Item.Image
        as={Image}
        size="tiny"
        fallbackSrc="/static/images/square-placeholder.png"
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
      <div className="flex">
        {!standAlone && (
          <Button
            content={itemSelected ? i18next.t('selected') : i18next.t('select')}
            className="align-self-center"
            floated="right"
            size="small"
            positive={itemSelected}
            onClick={() => setLocalCommunity(itemSelected ? null : result)}
          />
        )}

        {standAlone && (
          <Button
            icon="delete"
            floated="right"
            size="small"
            className="align-self-center"
            onClick={() => setLocalCommunity(null)}
          />
        )}
      </div>
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
