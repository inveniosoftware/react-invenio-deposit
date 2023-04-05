// This file is part of InvenioRDM
// Copyright (C) 2023 CERN.
//
// InvenioRDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/i18next";
import { CommunityTypeLabel } from "../labels";
import _truncate from "lodash/truncate";
import React from "react";
import PropTypes from "prop-types";

import { Image } from "react-invenio-forms";
import { Item, Grid, Icon } from "semantic-ui-react";
import { RestrictedLabel } from "../labels";
import { A11yPopup } from "react-invenio-forms";

export const CommunityCompactItemComputer = ({
  result,
  actions,
  extraLabels,
  itemClassName,
}) => {
  const { metadata, ui, links, access, id } = result;

  const communityType = ui?.type?.title_l10n;
  return (
    <Item
      key={id}
      className={`computer tablet only justify-space-between community-item ${itemClassName}`}
    >
      <Image size="tiny" src={links.logo} alt="" />
      <Grid>
        <Grid.Column width={10}>
          <Item.Content verticalAlign="middle">
            <Item.Header
              as="h3"
              className="ui small header flex align-items-center mb-5"
            >
              <a href={links.self_html} className="p-0">
                {metadata.title}
              </a>
            </Item.Header>

            <Item.Description>
              <div
                dangerouslySetInnerHTML={{
                  __html: _truncate(metadata.description, { length: 50 }),
                }}
              />
            </Item.Description>
            <Item.Extra>
              <RestrictedLabel access={access.visibility} />
              <CommunityTypeLabel type={communityType} />
              {extraLabels}
            </Item.Extra>
          </Item.Content>
        </Grid.Column>
        <Grid.Column width={5} verticalAlign="middle" align="right">
          <Item.Content>
            <Item.Meta>
              {ui.permissions.can_include_directly && (
                <A11yPopup
                  size="small"
                  trigger={<Icon name="paper plane outline" size="large" />}
                  ariaLabel={i18next.t("Submission information")}
                  content={i18next.t(
                    "Submission does not require review, and will be published directly."
                  )}
                />
              )}
              {!ui.permissions.can_include_directly && (
                <A11yPopup
                  size="small"
                  ariaLabel={i18next.t("Submission information")}
                  trigger={
                    <span>
                      <Icon name="comments outline" size="large" />
                      <Icon corner="top right" name="question" size="small" fitted />
                    </span>
                  }
                  content={i18next.t("Submission requires review.")}
                />
              )}
            </Item.Meta>
          </Item.Content>
        </Grid.Column>
      </Grid>
      <div className="flex align-items-center">{actions}</div>
    </Item>
  );
};

CommunityCompactItemComputer.propTypes = {
  result: PropTypes.object.isRequired,
  actions: PropTypes.node,
  extraLabels: PropTypes.node,
  itemClassName: PropTypes.string,
};

CommunityCompactItemComputer.defaultProps = {
  actions: undefined,
  extraLabels: undefined,
  itemClassName: "",
};
