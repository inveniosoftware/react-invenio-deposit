// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/i18next";
import React, { Component } from "react";
import { OverridableContext } from "react-overridable";
import {
  EmptyResults,
  Error,
  InvenioSearchApi,
  Pagination,
  ReactSearchKit,
  ResultsList,
  ResultsLoader,
  SearchBar,
} from "react-searchkit";
import { Container, Grid, Menu, Modal, Segment } from "semantic-ui-react";
import { CommunityListItem } from "./CommunityListItem";

const overriddenComponents = {
  "communities.ResultsList.item": CommunityListItem,
};

export class CommunitySelectionSearch extends Component {
  constructor(props) {
    super(props);

    this.apiEndpoints = {
      allCommunities: "/api/communities",
      myCommunities: "/api/user/communities",
    };

    const defaultEndpoint = this.apiEndpoints.allCommunities;

    this.state = {
      selectedEndpoint: defaultEndpoint,
    };
  }

  render() {
    const { selectedEndpoint } = this.state;
    const { allCommunities, myCommunities } = this.apiEndpoints;

    const searchApi = new InvenioSearchApi({
      axios: {
        url: selectedEndpoint,
        headers: { Accept: "application/vnd.inveniordm.v1+json" },
      },
    });

    const searchbarPlaceholder =
      selectedEndpoint === allCommunities
        ? i18next.t("Search in all communities")
        : i18next.t("Search in my communities");

    return (
      <OverridableContext.Provider value={overriddenComponents}>
        <ReactSearchKit
          appName="communities"
          urlHandlerApi={{ enabled: false }}
          searchApi={searchApi}
          key={selectedEndpoint}
          initialQueryState={{ size: 5, page: 1 }}
        >
          <Grid>
            <Grid.Row verticalAlign="middle">
              <Grid.Column width={8} textAlign="left" floated="left">
                <Menu compact>
                  <Menu.Item
                    name="All"
                    active={selectedEndpoint === allCommunities}
                    onClick={() =>
                      this.setState({
                        selectedEndpoint: allCommunities,
                      })
                    }
                  >
                    {i18next.t("All")}
                  </Menu.Item>
                  <Menu.Item
                    name="My communities"
                    active={selectedEndpoint === myCommunities}
                    onClick={() =>
                      this.setState({
                        selectedEndpoint: myCommunities,
                      })
                    }
                  >
                    {i18next.t("My communities")}
                  </Menu.Item>
                </Menu>
              </Grid.Column>
              <Grid.Column width={8} floated="right" verticalAlign="middle">
                <SearchBar
                  placeholder={searchbarPlaceholder}
                  autofocus
                  actionProps={{
                    icon: "search",
                    content: null,
                    className: "search",
                  }}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row verticalAlign="middle">
              <Grid.Column>
                <ResultsLoader>
                  <Segment className="community-list-container p-0">
                    <Modal.Content scrolling className="community-list-results">
                      <EmptyResults />
                      <Error />
                      <ResultsList />
                    </Modal.Content>
                  </Segment>
                  <Container textAlign="center">
                    <Pagination />
                  </Container>
                </ResultsLoader>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </ReactSearchKit>
      </OverridableContext.Provider>
    );
  }
}
