// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import { Header } from 'semantic-ui-react'

export class DepositFormTitle extends Component {

  render() {
    const content = this.props.isPublished ? "Edit Upload" : "New Upload";
    return (
      <Header as='h1' icon='upload' content={content} />
    );
  }
}
