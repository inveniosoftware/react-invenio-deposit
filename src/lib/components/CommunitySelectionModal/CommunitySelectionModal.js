// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';
import { CommunityContext } from './CommunityContext';
import { CommunitySelectionSearch } from './CommunitySelectionSearch';

export class CommunitySelectionModal extends Component {
  constructor(props) {
    super(props);

    const { chosenCommunity } = this.props;

    this.state = {
      modalOpen: false,
      localChosenCommunity: chosenCommunity,
    };

    this.contextValue = {
      setLocalCommunity: (community) => {
        const { onCommunityChange } = this.props;

        onCommunityChange(community);
        this.setState({ localChosenCommunity: null, modalOpen: false });
      },
      getChosenCommunity: () => this.state.localChosenCommunity,
    };
  }

  render() {
    const { modalOpen, localChosenCommunity } = this.state;
    const { trigger, chosenCommunity, disableTriggerButton } = this.props;

    return (
      <CommunityContext.Provider value={this.contextValue}>
        <Modal
          role="dialog"
          aria-labelledby="community-modal-header"
          id="community-selection-modal"
          className="m-0"
          closeIcon={true}
          closeOnDimmerClick={false}
          open={modalOpen}
          onClose={() => this.setState({ modalOpen: false })}
          onOpen={() =>
            this.setState({
              modalOpen: true,
              localChosenCommunity: chosenCommunity,
            })
          }
          trigger={
            <Button
              primary
              size="mini"
              className="community-header-button"
              name="setting"
              type="button"
              disabled={disableTriggerButton}
              aria-haspopup="dialog"
              aria-expanded={modalOpen}
            >
              {chosenCommunity ? i18next.t('Change') : i18next.t('Select a community')}
            </Button>
          }
        >
          <Modal.Header>
            <Header as="h2" id="community-modal-header">{i18next.t('Select a community')}</Header>
          </Modal.Header>

          <Modal.Content>
            <CommunitySelectionSearch chosenCommunity={localChosenCommunity} />
          </Modal.Content>
        </Modal>
      </CommunityContext.Provider>
    );
  }
}

CommunitySelectionModal.propTypes = {
  chosenCommunity: PropTypes.object,
  onCommunityChange: PropTypes.func.isRequired,
  disableTriggerButton: PropTypes.bool.isRequired
};

CommunitySelectionModal.defaultProps = {
  chosenCommunity: null,
};
