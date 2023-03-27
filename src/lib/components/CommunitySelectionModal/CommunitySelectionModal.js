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

export class CommunitySelectionModalComponent extends Component {
  constructor(props) {
    super(props);
    const {
      chosenCommunity,
      onCommunityChange,
      userCommunitiesMemberships,
      displaySelected,
    } = props;

    this.state = {
      localChosenCommunity: chosenCommunity,
    };

    this.contextValue = {
      setLocalCommunity: (community) => {
        onCommunityChange(community);
        this.setState({
          localChosenCommunity: community,
        });
      },
      // NOTE: We disable the eslint check as the actual destructing leads to a problem
      // related to the updated state value. To avoid this, we need to access the
      // `this.state` variable directly in the definition of the function so that any
      // consumption of it, will return always the latest updated value.
      // eslint-disable-next-line react/destructuring-assignment
      getChosenCommunity: () => this.state.localChosenCommunity,
      userCommunitiesMemberships,
      displaySelected,
    };
  }

  render() {
    const {
      chosenCommunity,
      trigger,
      extraContentComponents,
      modalHeader,
      onModalChange,
      modalOpen,
    } = this.props;

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
          onClose={() => {
            onModalChange && onModalChange(false);
          }}
          onOpen={() => {
            this.setState({
              localChosenCommunity: chosenCommunity,
            });
            onModalChange && onModalChange(true);
          }}
          trigger={React.cloneElement(trigger, {
            "aria-haspopup": "dialog",
            "aria-expanded": modalOpen,
          })}
        >
          <Modal.Header>
            <Header as="h2" id="community-modal-header">
              {modalHeader}
            </Header>
          </Modal.Header>

          <Modal.Content>
            <CommunitySelectionSearch />
            {extraContentComponents}
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
  extraContentComponents: PropTypes.node,
  modalHeader: PropTypes.string,
  onModalChange: PropTypes.func,
  displaySelected: PropTypes.bool,
  modalOpen: PropTypes.bool,
};

CommunitySelectionModalComponent.defaultProps = {
  chosenCommunity: undefined,
  extraContentComponents: undefined,
  modalHeader: i18next.t("Select a community"),
  onModalChange: undefined,
  displaySelected: false,
  modalOpen: false,
};

const mapStateToProps = (state) => ({
  userCommunitiesMemberships: state.deposit.config.user_communities_memberships,
});

export const CommunitySelectionModal = connect(
  mapStateToProps,
  null
)(CommunitySelectionModalComponent);
