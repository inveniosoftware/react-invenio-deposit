// This file is part of InvenioRDM
// Copyright (C) 2022 CERN.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { CommunityTypeLabel } from "../labels";
import { RestrictedLabel } from "../labels";
import _truncate from "lodash/truncate";
import React from "react";
import { Image } from "react-invenio-forms";
import { Item } from "semantic-ui-react";
import PropTypes from "prop-types";

export const CommunityCompactItemMobile = ({
  result,
  actions,
  extraLabels,
  itemClassName,
}) => {
  const { metadata, ui, links, access, id } = result;
  const communityType = ui?.type?.title_l10n;

  return (
    <Item key={id} className={`mobile only justify-space-between ${itemClassName}`}>
      <Image size="mini" src={links.logo} alt="" />

      <Item.Content verticalAlign="middle">
        <Item.Header as="h3" className="ui small header text-align-center mb-5">
          <a href={links.self_html} className="p-0">
            {metadata.title}
          </a>
        </Item.Header>

        <Item.Description
          dangerouslySetInnerHTML={{
            __html: _truncate(metadata.description, { length: 50 }),
          }}
        />
        <Item.Extra className="text-align-center">
          <RestrictedLabel access={access.visibility} />
          <CommunityTypeLabel type={communityType} />
          {extraLabels}
        </Item.Extra>
      </Item.Content>

      <div className="flex flex-direction-column align-items-center rel-mt-1">
        {actions}
      </div>
    </Item>
  );
};

CommunityCompactItemMobile.propTypes = {
  result: PropTypes.object.isRequired,
  actions: PropTypes.node,
  extraLabels: PropTypes.node,
  itemClassName: PropTypes.string,
};

CommunityCompactItemMobile.defaultProps = {
  actions: undefined,
  extraLabels: undefined,
  itemClassName: "",
};
