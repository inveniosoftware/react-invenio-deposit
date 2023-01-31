// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/i18next";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Modal } from "semantic-ui-react";
import { CommunityContext } from "./CommunityContext";
import { CommunitySelectionSearch } from "./CommunitySelectionSearch";

class CommunitySelectionModalComponent extends Component {
  constructor(props) {
    super(props);
    const { chosenCommunity, onCommunityChange, userCommunitiesMemberships } = props;

    this.state = {
      modalOpen: false,
      localChosenCommunity: chosenCommunity,
    };

    this.contextValue = {
      setLocalCommunity: (community) => {
        onCommunityChange(community);
        this.setState({ localChosenCommunity: null, modalOpen: false });
      },
      // eslint-disable-next-line react/destructuring-assignment
      getChosenCommunity: () => this.state.localChosenCommunity,
      userCommunitiesMemberships,
    };
  }

  render() {
    const { modalOpen } = this.state;
    const { chosenCommunity, trigger } = this.props;
    return (
      <CommunityContext.Provider value={this.contextValue}>
        <Modal
          role="dialog"
          aria-labelledby="community-modal-header"
          id="community-selection-modal"
          className="m-0"
          closeIcon
          closeOnDimmerClick={false}
          open={modalOpen}
          onClose={() => this.setState({ modalOpen: false })}
          onOpen={() => {
            this.setState({
              modalOpen: true,
              localChosenCommunity: chosenCommunity,
            });
          }}
          trigger={React.cloneElement(trigger, {
            "aria-haspopup": "dialog",
            "aria-expanded": modalOpen,
          })}
        >
          <Modal.Header>
            <Header as="h2" id="community-modal-header">
              {i18next.t("Select a community")}
            </Header>
          </Modal.Header>

          <Modal.Content>
            <CommunitySelectionSearch />
          </Modal.Content>
        </Modal>
      </CommunityContext.Provider>
    );
  }
}

CommunitySelectionModalComponent.propTypes = {
  chosenCommunity: PropTypes.object,
  onCommunityChange: PropTypes.func.isRequired,
  trigger: PropTypes.object.isRequired,
  userCommunitiesMemberships: PropTypes.object.isRequired,
};

CommunitySelectionModalComponent.defaultProps = {
  chosenCommunity: null,
};

const mapStateToProps = (state) => ({
  userCommunitiesMemberships: state.deposit.config.user_communities_memberships,
});

export const CommunitySelectionModal = connect(
  mapStateToProps,
  null
)(CommunitySelectionModalComponent);
