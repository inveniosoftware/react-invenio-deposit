// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Modal } from 'semantic-ui-react';
import { ActionButton } from 'react-invenio-forms';

import { discard } from '../state/actions';

export class DeleteButtonComponent extends Component {
  state = { modalOpen: false };

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  isDisabled = (formik) => {
    return !this.props.isSaved || formik.isSubmitting;
  };

  render() {
    const {
      isSaved,
      isPublished,
      deleteClick,
      ...uiProps // only has ActionButton props
    } = this.props;

    const handleDelete = (event, formik) => {
      deleteClick(event, formik);
      this.hanldeClose();
    };

    const action = isPublished ? 'discard' : 'delete';
    const titleizedAction = action[0].toUpperCase() + action.slice(1);

    return (
      <>
        <ActionButton
          isDisabled={this.isDisabled}
          name="delete"
          onClick={this.handleOpen}
          negative
          icon
          labelPosition="left"
          {...uiProps}
        >
          {(formik) => (
            <>
              <Icon name="trash alternate outline" />
              {titleizedAction}
            </>
          )}
        </ActionButton>

        <Modal open={this.state.modalOpen} onClose={this.handleClose} size="tiny">
          <Modal.Content>
            <h3>Are you sure you want to {action} this draft?</h3>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleClose} floated="left">
              Cancel
            </Button>
            <Button negative onClick={handleDelete}>
              {titleizedAction}
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isSaved: Boolean(state.deposit.record.id),
});

const mapDispatchToProps = (dispatch) => ({
  deleteClick: (event, formik) => {
    dispatch(discard(event, formik));
  },
});

export const DeleteButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteButtonComponent);
