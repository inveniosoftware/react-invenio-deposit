// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { ActionButton } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { discard } from '../state/actions';
import { toCapitalCase } from '../utils';
import { i18next } from '@translations/i18next';

// action
const DISCARD_CHANGES = i18next.t('discard changes');
const DISCARD_VERSION = i18next.t('discard version');
const DELETE = i18next.t('delete');

// action messages
const DISCARD_CHANGES_MSG = i18next.t(
  'Are you sure you want to discard the changes to this draft?'
);

const DISCARD_VERSION_MSG = i18next.t(
  'Are you sure you want to delete this new version?'
);
const DISCARD_DELETE_MSG = i18next.t(
  'Are you sure you want to delete this draft?'
);

const DialogText = ({ action }) => {
  let text = '';
  switch (action) {
    case DISCARD_CHANGES:
      text = DISCARD_CHANGES_MSG;
      break;
    case DISCARD_VERSION:
      text = DISCARD_VERSION_MSG;
      break;
    case DELETE:
      text = DISCARD_DELETE_MSG;
      break;
    default:
      break;
  }
  return text;
};

export class DeleteButtonComponent extends Component {
  state = { modalOpen: false, isDeleting: false };

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  isDisabled = (formik) => {
    const { isDeleting } = this.state;
    return !this.props.isSaved || formik.isSubmitting || isDeleting;
  };

  render() {
    const {
      isSaved,
      isPublished,
      deleteClick,
      isVersion,
      ...uiProps // only has ActionButton props
    } = this.props;
    const { isDeleting } = this.state;
    const handleDelete = (event, formik) => {
      this.setState({ isDeleting: true });
      deleteClick(event, formik).then(() => {
        this.setState({ isDeleting: false });
      });
      this.handleClose();
    };

    let action = '';
    if (!this.props.isPublished) {
      action = this.props.isVersion ? DISCARD_VERSION : DELETE;
    } else {
      action = DISCARD_CHANGES;
    }
    const color = { color: isPublished ? 'yellow' : 'red' };
    const capitalizedAction = toCapitalCase(action);

    return (
      <>
        <ActionButton
          isDisabled={this.isDisabled}
          name="delete"
          onClick={this.handleOpen}
          {...color}
          icon
          labelPosition="left"
          {...uiProps}
        >
          {(formik) => (
            <>
              {formik.isSubmitting && isDeleting ? (
                <Icon size="large" loading name="spinner" />
              ) : (
                <Icon name="trash alternate outline" />
              )}
              {capitalizedAction}
            </>
          )}
        </ActionButton>

        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          size="tiny"
        >
          <Modal.Content>
            <h3>
              <DialogText action={action} />
            </h3>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleClose} floated="left">
              Cancel
            </Button>
            <ActionButton
              {...color}
              name="delete"
              onClick={handleDelete}
              content={capitalizedAction}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isSaved: Boolean(state.deposit.record.id),
  isPublished: state.deposit.record.is_published,
  isVersion: state.deposit.record.versions?.index > 1,
});

const mapDispatchToProps = (dispatch) => ({
  deleteClick: (event, formik) => dispatch(discard(event, formik)),
});

export const DeleteButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteButtonComponent);
