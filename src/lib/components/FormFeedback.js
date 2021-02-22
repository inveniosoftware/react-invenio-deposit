// This file is part of InvenioRDM
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _flatMapDeep from 'lodash/flatMapDeep';
import _get from 'lodash/get';
import _isString from 'lodash/isString';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Message } from 'semantic-ui-react';
import {
  FORM_PUBLISH_FAILED,
  FORM_SAVE_FAILED,
  FORM_SAVE_PARTIALLY_SUCCEEDED,
  FORM_SAVE_SUCCEEDED,
} from '../state/types';

class DisconnectedFormFeedback extends Component {
  render() {
    const visibleStates = [
      FORM_SAVE_SUCCEEDED,
      FORM_SAVE_PARTIALLY_SUCCEEDED,
      FORM_SAVE_FAILED,
      FORM_PUBLISH_FAILED,
    ];
    const formState = this.props.formState;

    const errors = this.props.errors || {};
    let feedback;
    let message = null;

    switch (formState) {
      case FORM_SAVE_SUCCEEDED:
        feedback = 'positive';
        message = 'Record successfully saved.';
        break;
      case FORM_SAVE_PARTIALLY_SUCCEEDED:
        feedback = 'warning';
        message = 'Record partially saved.';
        break;
      case FORM_SAVE_FAILED:
      case FORM_PUBLISH_FAILED:
        feedback = 'negative';
        // TODO: use the backend error message
        message = 'There was an error.';
        break;
      default:
    }

    // NOTE: only dealing with top-level key simplifies our lives greatly
    const listErrors = Object.keys(_get(errors, 'metadata', {})).map((k) => {
      // TODO: Use some vocabulary(?) to get human readable label
      const fieldLabel = k;
      const value = errors.metadata[k];
      let fieldErrorMessage;
      if (_isString(value)) {
        fieldErrorMessage = value;
      } else {
        // WHY: value may be an object with sub-objects (e.g.
        // errors = {
        //    metadata: {
        //      creators: [
        //        {title: "Missing value" },
        //        {name: "Missing value" }
        //      ]
        //    }
        // }
        //)
        // but we want the leaves
        //      i.e. all error messages for a top-level field in a single
        //      string (for now).
        // TODO: Revisit when dealing with UX error more thoroughly
        fieldErrorMessage = _flatMapDeep(value).join(' ');
      }
      return (
        <Message.Item key={k}>
          <b>{fieldLabel}</b>: {fieldErrorMessage}
        </Message.Item>
      );
    });

    return visibleStates.includes(formState) ? (
      <Message
        visible
        positive={feedback === 'positive'}
        warning={feedback === 'warning'}
        negative={feedback === 'negative'}
        className="flashed top-attached"
      >
        <Grid container>
          <Grid.Column width={15} textAlign="left">
            <Message.Header>{message}</Message.Header>
            { listErrors.length > 0 && <Message.List>{listErrors}</Message.List> }
          </Grid.Column>
        </Grid>
      </Message>
    ) : null;
  };
}

const mapStateToProps = (state) => ({
  formState: state.deposit.formState,
  errors: state.deposit.errors,
});

export const FormFeedback = connect(
  mapStateToProps,
  null
)(DisconnectedFormFeedback);
