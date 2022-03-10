// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PublishButton } from './PublishButton';
import { SubmitReviewButton } from './SubmitReviewButton';

class SubmitReviewOrPublishComponent extends Component {
  state = { confirmOpen: false };

  handleOpen = () => this.setState({ confirmOpen: true });

  handleClose = () => this.setState({ confirmOpen: false });

  render() {
    const { communityState, state, ...ui } = this.props;

    const shouldUpdateReview =
      communityState.selected && !communityState.isRecordInSelectedCommunity;

    return shouldUpdateReview ? (
      <SubmitReviewButton {...ui} />
    ) : (
      <PublishButton {...ui} />
    );
  }
}

const mapStateToProps = (state) => ({
  communityState: state.deposit.community,
});

export const SubmitReviewOrPublishButton = connect(
  mapStateToProps,
  null
)(SubmitReviewOrPublishComponent);
