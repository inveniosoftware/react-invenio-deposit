// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/i18next";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Header, Modal } from "semantic-ui-react";
import { CommunityContext } from "./CommunityContext";
import { CommunitySelectionSearch } from "./CommunitySelectionSearch";

export class CommunitySelectionModal extends Component {
  constructor(props) {
    super(props);
    const { chosenCommunity, onCommunityChange } = props;

    this.state = {
      modalOpen: false,
      localChosenCommunity: chosenCommunity,
    };

    const { localChosenCommunity } = this.state;

    this.contextValue = {
      setLocalCommunity: (community) => {
        onCommunityChange(community);
        this.setState({ localChosenCommunity: null, modalOpen: false });
      },
      getChosenCommunity: () => localChosenCommunity,
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
          onOpen={() =>
            this.setState({
              modalOpen: true,
              localChosenCommunity: chosenCommunity,
            })
          }
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

CommunitySelectionModal.propTypes = {
  chosenCommunity: PropTypes.object,
  onCommunityChange: PropTypes.func.isRequired,
  trigger: PropTypes.object.isRequired,
};

CommunitySelectionModal.defaultProps = {
  chosenCommunity: null,
};
