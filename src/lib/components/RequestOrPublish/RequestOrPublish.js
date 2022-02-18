// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PublishButton } from './PublishButton';
import { RequestReviewButton } from './RequestReviewButton';

export class RequestOrPublishComponent extends Component {
  state = { confirmOpen: false };

  handleOpen = () => this.setState({ confirmOpen: true });

  handleClose = () => this.setState({ confirmOpen: false });

  render() {
    const { userSelectedCommunity, ...ui } = this.props;
    return userSelectedCommunity ? (
      <RequestReviewButton {...ui} />
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
