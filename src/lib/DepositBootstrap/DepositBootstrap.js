// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BaseForm } from 'react-invenio-forms';
import { Container } from 'semantic-ui-react';

export default class DepositBootstrap extends Component {
  componentDidMount() {
    window.addEventListener('beforeunload', (e) => {
      if (this.props.fileUploadOngoing) {
        e.returnValue = '';
        return '';
      }
    });
    window.addEventListener('unload', async (e) => {
      // TODO: cancel all uploads
      // Investigate if it's possible to wait for the deletion request to complete
      // before unloading the page
    });
  }

  render() {
    return (
      <Container style={{ marginTop: '35px' }}>
        <BaseForm
          onSubmit={this.props.submitFormData}
          formik={{
            enableReinitialize: true,
            initialValues: this.props.record,
          }}
        >
          {this.props.children}
        </BaseForm>
      </Container>
    );
  }
}

DepositBootstrap.propTypes = {};
