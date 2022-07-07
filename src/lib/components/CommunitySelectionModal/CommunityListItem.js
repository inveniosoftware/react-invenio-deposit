// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/i18next";
import _truncate from "lodash/truncate";
import _capitalize from "lodash/capitalize";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { Image } from "react-invenio-forms";
import { Button, Icon, Item, Label } from "semantic-ui-react";
import { CommunityContext } from "./CommunityContext";

export const CommunityListItem = ({ result }) => {
  const { setLocalCommunity, getChosenCommunity } = useContext(CommunityContext);

  const { metadata, ui } = result;
  const linkToCommunityPage = result.links.self_html;
  const linkToLogo = result.links.logo;
  const itemSelected = getChosenCommunity()?.id === result.id;
  const typeL10n = ui.type?.title_l10n;
  const isRestricted = result.access.visibility === "restricted";

  return (
    <Item key={result.id} className={itemSelected ? "selected" : ""}>
      <Image
        size="tiny"
        className="community-logo"
        src={linkToLogo}
        fallbackSrc="/static/images/square-placeholder.png"
        as={Item.Image}
      />

      <Item.Content>
        <Item.Header>
          {metadata.title}
          {isRestricted && (
            <Label size="tiny" color="red" className="rel-ml-1">
              <Icon name="ban" />
              {_capitalize(result.access.visibility)}
            </Label>
          )}
          <Button
            as="a"
            href={linkToCommunityPage}
            target="_blank"
            rel="noreferrer"
            size="small"
            className="transparent pt-0 ml-15 mb-5"
            content={i18next.t("View community")}
            icon="external alternate"
            title={i18next.t("Opens in new tab")}
          />
        </Item.Header>
        <Item.Description as="p" className="rel-pr-1">
          {_truncate(metadata.description, { length: 150 })}
        </Item.Description>
        {typeL10n && <Item.Extra>{typeL10n}</Item.Extra>}
      </Item.Content>
      <Item.Extra className="flex width auto mt-0">
        <div className="align-self-center">
          <Button
            content={itemSelected ? i18next.t("Selected") : i18next.t("Select")}
            size="small"
            positive={itemSelected}
            onClick={() => setLocalCommunity(result)}
            aria-label={i18next.t("Select ") + metadata.title}
          />
        </div>
      </Item.Extra>
    </Item>
  );
};

CommunityListItem.propTypes = {
  result: PropTypes.object.isRequired,
};
