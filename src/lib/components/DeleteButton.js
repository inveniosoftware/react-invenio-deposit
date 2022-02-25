// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021-2022 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import React, { Component } from 'react';
import { ActionButton } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Button, Icon, Modal } from 'semantic-ui-react';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../DepositFormSubmitContext';
import { DRAFT_DELETE_STARTED } from '../state/types';
import { toCapitalCase } from '../utils';

// action
const DISCARD_CHANGES_LBL = i18next.t('discard changes');
const DISCARD_VERSION_LBL = i18next.t('discard version');
const DELETE_LBL = i18next.t('delete');

// action messages
const DISCARD_CHANGES_DLG = i18next.t(
  'Are you sure you want to discard the changes to this draft?'
);

const DISCARD_VERSION_DLG = i18next.t(
  'Are you sure you want to delete this new version?'
);
const DISCARD_DELETE_DLG = i18next.t(
  'Are you sure you want to delete this draft?'
);

const DialogText = ({ actionLbl }) => {
  let text = '';
  switch (actionLbl) {
    case DISCARD_CHANGES_LBL:
      text = DISCARD_CHANGES_DLG;
      break;
    case DISCARD_VERSION_LBL:
      text = DISCARD_VERSION_DLG;
      break;
    case DELETE_LBL:
      text = DISCARD_DELETE_DLG;
      break;
    default:
      break;
  }
  return text;
};

export class DeleteButtonComponent extends Component {
  static contextType = DepositFormSubmitContext;
  state = { modalOpen: false };

  openConfirmModal = () => this.setState({ modalOpen: true });

  closeConfirmModal = () => this.setState({ modalOpen: false });

  handleDelete = async (event, formik) => {
    const { isPublished, isVersion } = this.props;
    this.context.setSubmitContext(DepositFormSubmitActions.DELETE, {
      isDiscardingVersion: isPublished || isVersion,
    });
    formik.handleSubmit(event);
    this.closeConfirmModal();
  };

  render() {
    const {
      draftExists,
      isPublished,
      isVersion,
      actionState,
      ...uiProps // only has ActionButton props
    } = this.props;

    let actionLbl = '';
    if (!isPublished) {
      actionLbl = isVersion ? DISCARD_VERSION_LBL : DELETE_LBL;
    } else {
      actionLbl = DISCARD_CHANGES_LBL;
    }
    const color = { color: isPublished ? 'yellow' : 'red' };
    const capitalizedActionLbl = toCapitalCase(actionLbl);

    return (
      <>
        <ActionButton
          isDisabled={(formik) => !draftExists || formik.isSubmitting}
          name="delete"
          onClick={this.openConfirmModal}
          {...color}
          icon
          labelPosition="left"
          {...uiProps}
          content={capitalizedActionLbl}
        />

        <Modal
          open={this.state.modalOpen}
          onClose={this.closeConfirmModal}
          size="tiny"
        >
          <Modal.Content>
            <h3>
              <DialogText actionLbl={actionLbl} />
            </h3>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeConfirmModal} floated="left">
              Cancel
            </Button>
            <ActionButton {...color} name="delete" onClick={this.handleDelete}>
              {(formik) => (
                <>
                  {formik.isSubmitting &&
                  actionState === DRAFT_DELETE_STARTED ? (
                    <Icon size="large" loading name="spinner" />
                  ) : (
                    <Icon name="trash alternate outline" />
                  )}
                  {capitalizedActionLbl}
                </>
              )}
            </ActionButton>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  draftExists: Boolean(state.deposit.record.id),
  isPublished: state.deposit.record.is_published,
  isVersion: state.deposit.record.versions?.index > 1,
  actionState: state.deposit.actionState,
});

export const DeleteButton = connect(
  mapStateToProps,
  null
)(DeleteButtonComponent);
