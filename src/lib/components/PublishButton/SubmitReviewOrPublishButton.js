// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { i18next } from '@translations/i18next';

import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { PublishButton } from './PublishButton';
import { SubmitReviewButton } from './SubmitReviewButton';
import { CommunitySelectionModal } from '../CommunitySelectionModal';
import { changeSelectedCommunity } from '../../state/actions';

class SubmitReviewOrPublishComponent extends Component {
  state = { confirmOpen: false };

  handleOpen = () => this.setState({ confirmOpen: true });

  handleClose = () => this.setState({ confirmOpen: false });

  render() {
    const {
      community,
      changeSelectedCommunity,
      showChangeCommunityButton,
      showSubmitForReviewButton,
      ...ui
    } = this.props;

    return showSubmitForReviewButton ? (
      <SubmitReviewButton {...ui} />
    ) : showChangeCommunityButton ? (
      <>
        <div className="mb-5">
          <CommunitySelectionModal
            onCommunityChange={(community) => {
              changeSelectedCommunity(community);
            }}
            chosenCommunity={community}
            trigger={<Button fluid>{i18next.t('Change community')}</Button>}
          />
        </div>
        <PublishButton
          buttonLabel={i18next.t('Publish without community')}
          publishWithoutCommunity={true}
          {...ui}
        />
      </>
    ) : (
      <PublishButton {...ui} />
    );
  }
}

const mapStateToProps = (state) => ({
  community: state.deposit.editorState.selectedCommunity,
  showSubmitForReviewButton:
    state.deposit.editorState.ui.showSubmitForReviewButton,
  showChangeCommunityButton:
    state.deposit.editorState.ui.showChangeCommunityButton,
});

const mapDispatchToProps = (dispatch) => ({
  changeSelectedCommunity: (community) =>
    dispatch(changeSelectedCommunity(community)),
});

export const SubmitReviewOrPublishButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitReviewOrPublishComponent);
