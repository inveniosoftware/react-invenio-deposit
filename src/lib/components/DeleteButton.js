// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { ActionButton } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { discard } from '../state/actions';
import { toCapitalCase } from '../utils';

const DialogText = ({ action }) => {
  let text = '';
  switch (action) {
    case 'discard changes':
      text = 'Are you sure you want to discard the changes to this draft?';
      break;
    case 'discard version':
      text = 'Are you sure you want to delete this new version?';
      break;
    case 'delete':
      text = 'Are you sure you want to delete this draft?';
      break;
    default:
      break;
  }
  return text;
};

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
      isVersion,
      ...uiProps // only has ActionButton props
    } = this.props;

    const handleDelete = (event, formik) => {
      deleteClick(event, formik);
      this.handleClose();
    };

    let action = '';
    if (!this.props.isPublished) {
      action = this.props.isVersion ? 'discard version' : 'delete';
    } else {
      action = 'discard changes';
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
              <Icon name="trash alternate outline" />
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
            <Button {...color} onClick={handleDelete}>
              {capitalizedAction}
            </Button>
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
