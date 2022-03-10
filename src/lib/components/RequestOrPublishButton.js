// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PublishButton } from './PublishButton';
import { SubmitReviewButton } from './SubmitReviewButton';

export class RequestOrPublishComponent extends Component {
  state = { confirmOpen: false };

  handleOpen = () => this.setState({ confirmOpen: true });

  handleClose = () => this.setState({ confirmOpen: false });

  render() {
    const { userSelectedCommunity, ...ui } = this.props;
    return userSelectedCommunity ? (
      <SubmitReviewButton {...ui} />
    ) : (
      <PublishButton {...ui} />
    );
  }
}

const mapStateToProps = (state) => ({
  userSelectedCommunity: state.communities.defaultCommunity,
});

export const RequestOrPublish = connect(
  mapStateToProps,
  null
)(RequestOrPublishComponent);
