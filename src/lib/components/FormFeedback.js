// This file is part of InvenioRDM
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from 'lodash/get';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Message } from 'semantic-ui-react';
import {
  FORM_DELETE_FAILED,
  FORM_PUBLISH_FAILED,
  FORM_SAVE_FAILED,
  FORM_SAVE_PARTIALLY_SUCCEEDED,
  FORM_SAVE_SUCCEEDED,
} from '../state/types';
import { leafTraverse } from '../utils';
import { i18next } from '@translations/i18next';

const defaultLabels = {
  'files.enabled': i18next.t('Files'),
  'metadata.resource_type': i18next.t('Resource type'),
  'metadata.title': i18next.t('Title'),
  'metadata.additional_titles': i18next.t('Title'), // to display under Title label
  'metadata.publication_date': i18next.t('Publication date'),
  'metadata.creators': i18next.t('Creators'),
  'metadata.contributors': i18next.t('Contributors'),
  'metadata.description': i18next.t('Description'),
  // to display under Description
  'metadata.additional_descriptions': i18next.t('Description'),
  'metadata.rights': i18next.t('Licenses'),
  'metadata.languages': i18next.t('Languages'),
  'metadata.dates': i18next.t('Dates'),
  'metadata.version': i18next.t('Version'),
  'metadata.publisher': i18next.t('Publisher'),
  'metadata.related_identifiers': i18next.t('Related works'),
  'access.embargo.until': i18next.t('Embargo until'),
};

class DisconnectedFormFeedback extends Component {
  constructor(props) {
    super(props);
    this.labels = {
      ...defaultLabels,
      ...props.labels,
    };
  }

  /**
   * Render error messages inline (if 1) or as list (if multiple).
   *
   * @param {Array<String>} messages
   * @returns String or React node
   */
  renderErrorMessages(messages) {
    if (messages.length === 1) {
      return messages[0];
    } else {
      return (
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      );
    }
  }

  /**
   * Return array of error messages from errorValue object.
   *
   * The error message(s) might be deeply nested in the errorValue e.g.
   *
   * errorValue = [
   *   {
   *     title: "Missing value"
   *   }
   * ];
   *
   * @param {object} errorValue
   * @returns array of Strings (error messages)
   */
  toErrorMessages(errorValue) {
    let messages = [];
    let store = (l) => {
      messages.push(l);
    };
    leafTraverse(errorValue, store);
    return messages;
  }

  /**
   * Return object with human readbable labels as keys and error messages as
   * values given an errors object.
   *
   * @param {object} errors
   * @returns object
   */
  toLabelledErrorMessages(errors) {
    // Step 0 - Create object with collapsed 1st and 2nd level keys
    //          e.g., {metadata: {creators: ,,,}} => {"metadata.creators": ...}
    // For now, only for metadata, files and access.embargo
    const metadata = errors.metadata || {};
    const step0_metadata = Object.entries(metadata).map(([key, value]) => {
      return ['metadata.' + key, value];
    });
    const files = errors.files || {};
    const step0_files = Object.entries(files).map(([key, value]) => {
      return ['files.' + key, value];
    });
    const access = errors.access?.embargo || {};
    const step0_access = Object.entries(access).map(([key, value]) => {
      return ['access.embargo.' + key, value];
    });
    const step0 = Object.fromEntries(
      step0_metadata.concat(step0_files).concat(step0_access)
    );

    // Step 1 - Transform each error value into array of error messages
    const step1 = Object.fromEntries(
      Object.entries(step0).map(([key, value]) => {
        return [key, this.toErrorMessages(value)];
      })
    );

    // Step 2 - Group error messages by label
    // (different error keys can map to same label e.g. title and
    // additional_titles)
    const labelledErrorMessages = {};
    for (const key in step1) {
      const label = this.labels[key] || 'Unknown field';
      let messages = labelledErrorMessages[label] || [];
      labelledErrorMessages[label] = messages.concat(step1[key]);
    }

    return labelledErrorMessages;
  }

  render() {
    const visibleStates = [
      FORM_SAVE_SUCCEEDED,
      FORM_SAVE_PARTIALLY_SUCCEEDED,
      FORM_SAVE_FAILED,
      FORM_PUBLISH_FAILED,
      FORM_DELETE_FAILED,
    ];
    const formState = this.props.formState;

    const errors = this.props.errors || {};
    let feedback;
    let message = null;

    switch (formState) {
      case FORM_SAVE_SUCCEEDED:
        feedback = 'positive';
        message = i18next.t('Record successfully saved.');
        break;
      case FORM_SAVE_PARTIALLY_SUCCEEDED:
        feedback = 'warning';
        message = i18next.t('Record saved with validation errors:');
        break;
      case FORM_SAVE_FAILED:
      case FORM_PUBLISH_FAILED:
        feedback = 'negative';
        // TODO: use the backend error message
        message = i18next.t('There was an internal error (and the record was not saved).');
        break;
      case FORM_DELETE_FAILED:
        feedback = 'negative';
        message = i18next.t('There was an internal error (and the record was not deleted).');
      default:
    }

    const labelledMessages = this.toLabelledErrorMessages(errors);
    const listErrors = Object.entries(labelledMessages).map(
      ([label, messages]) => (
        <Message.Item key={label}>
          <b>{label}</b>: {this.renderErrorMessages(messages)}
        </Message.Item>
      )
    );

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
            <strong>{message}</strong>
            {listErrors.length > 0 && <Message.List>{listErrors}</Message.List>}
          </Grid.Column>
        </Grid>
      </Message>
    ) : null;
  }
}

const mapStateToProps = (state) => ({
  formState: state.deposit.formState,
  errors: state.deposit.errors,
});

export const FormFeedback = connect(
  mapStateToProps,
  null
)(DisconnectedFormFeedback);
