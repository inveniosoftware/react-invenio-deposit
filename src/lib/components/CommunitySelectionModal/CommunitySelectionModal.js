// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { Header, Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { i18next } from '@translations/i18next';
import { CommunitySelectionSearch } from './CommunitySelectionSearch';
import { CommunitySelectionFooter } from './CommunitySelectionFooter';
import { CommunityContext } from './CommunityContext';

export class CommunitySelectionModal extends Component {
  constructor(props) {
    super(props);

    const { chosenCommunity } = this.props;

    this.state = {
      modalOpen: false,
      localChosenCommunity: chosenCommunity,
    };

    this.contextValue = {
      setLocalCommunity: (community) =>
        this.setState({ localChosenCommunity: community }),
      getChosenCommunity: () => this.state.localChosenCommunity,
    };
  }

  onSave = (chosenCommunity) => {
    const { onCommunityChange } = this.props;

    onCommunityChange(chosenCommunity);
    this.setState({ localChosenCommunity: null, modalOpen: false });
  };

  render() {
    const { modalOpen, localChosenCommunity } = this.state;
    const { trigger, chosenCommunity } = this.props;

    return (
      <CommunityContext.Provider value={this.contextValue}>
        <Modal
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
          trigger={trigger}
        >
          <Modal.Header>
            <Header as="h2">{i18next.t('Select a community')}</Header>
          </Modal.Header>

          <Modal.Content>
            <CommunitySelectionSearch chosenCommunity={localChosenCommunity} />
            <CommunitySelectionFooter />
          </Modal.Content>

          <Modal.Actions>
            <Button
              name="close"
              onClick={() => {
                this.setState({ modalOpen: false, localChosenCommunity: null });
              }}
              icon="remove"
              content={i18next.t('Close')}
            />
            <Button
              name="submit"
              primary
              onClick={() => this.onSave(localChosenCommunity)}
              icon="checkmark"
              type="submit"
              content={i18next.t('Save')}
            />
          </Modal.Actions>
        </Modal>
      </CommunityContext.Provider>
    );
  }
}

CommunitySelectionModal.propTypes = {
  chosenCommunity: PropTypes.object,
  onCommunityChange: PropTypes.func.isRequired,
  trigger: PropTypes.node,
};

CommunitySelectionModal.defaultProps = {
  chosenCommunity: null,
};
