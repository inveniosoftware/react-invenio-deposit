// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react';

class DepositFormTitleComponent extends Component {
  render() {
    let content = '';
    if (!this.props.isPublished) {
      content = this.props.isVersion ? 'New version' : 'New upload';
    } else {
      content = 'Edit upload';
    }
    return <Header as="h1" icon="upload" content={content} />;
  }
}

const mapStateToProps = (state) => ({
  isPublished: state.deposit.record.is_published,
  isVersion: state.deposit.record.versions?.index > 1,
});

export const DepositFormTitle = connect(
  mapStateToProps,
  null
)(DepositFormTitleComponent);
