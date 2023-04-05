// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/i18next";
import { Trans } from "react-i18next";
import _capitalize from "lodash/capitalize";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { CommunityCompactItem } from "../Communities/search";
import { CommunityContext } from "./CommunityContext";

export const CommunityListItem = ({ result }) => {
  const {
    setLocalCommunity,
    getChosenCommunity,
    userCommunitiesMemberships,
    displaySelected,
  } = useContext(CommunityContext);

  const { metadata } = result;
  const itemSelected = getChosenCommunity()?.id === result.id;
  const userMembership = userCommunitiesMemberships[result["id"]];

  const actions = (
    <Button
      content={
        displaySelected && itemSelected ? i18next.t("Selected") : i18next.t("Select")
      }
      size="small"
      positive={displaySelected && itemSelected}
      onClick={() => setLocalCommunity(result)}
      aria-label={i18next.t("Select {{ title }}", { title: metadata.title })}
    />
  );

  const extraLabels = (
    <>
      {userMembership && (
        <Label size="tiny" horizontal color="teal">
          <Icon name="key" />
          {_capitalize(userMembership)}
        </Label>
      )}
    </>
  );

  return (
    <CommunityCompactItem result={result} actions={actions} extraLabels={extraLabels} />
  );
};

CommunityListItem.propTypes = {
  result: PropTypes.object.isRequired,
};
