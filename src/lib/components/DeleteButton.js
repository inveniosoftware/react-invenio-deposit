// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Modal } from 'semantic-ui-react';
import { ActionButton } from 'react-invenio-forms';

import { discard } from '../state/actions';


export default class DeleteButtonComponent extends Component {
  state = { modalOpen: false };

  open = () => this.setState({ modalOpen: true });

  close = () => this.setState({ modalOpen: false });

  handleClick = (event, formik) => {
    this.props.handleClick(event, formik);
    this.close();
  };

  isDisabled = (formik) => {
    return !this.props.isSaved || formik.isSubmitting;
  };

  render() {
    const {
      isSaved,
      isPublished,
      handleClick,
      ...uiProps  // only has ActionButton props
    } = this.props;

    const action = isPublished ? 'discard' : 'delete';
    const titleizedAction = action[0].toUpperCase() + action.slice(1);

    return (
      <>
        <ActionButton
          isDisabled={this.isDisabled}
          name="delete"
          onClick={this.open}
          negative
          icon
          labelPosition='left'
          {...uiProps}
        >
          {(formik) => (
            <>
              <Icon name='trash alternate outline' />
              {titleizedAction}
            </>
          )}
        </ActionButton>

        <Modal
          open={this.state.modalOpen}
          onClose={this.close}
          size="tiny"
        >
          <Modal.Content>
            <h3>Are you sure you want to {action} this draft?</h3>
          </Modal.Content>
          <Modal.Actions>
            <Button secondary onClick={this.close}>
              Cancel
            </Button>
            <Button negative onClick={this.handleClick}>
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
  handleClick: (event, formik) => {
    dispatch(discard(event, formik));
  }
});

export const DeleteButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteButtonComponent);
