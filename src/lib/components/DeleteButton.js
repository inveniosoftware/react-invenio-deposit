// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021-2022 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connect as connectFormik } from 'formik';
import { Button, Modal } from 'semantic-ui-react';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../DepositFormSubmitContext';
import { DRAFT_DELETE_STARTED } from '../state/types';
import { toCapitalCase } from '../utils';
import _omit from 'lodash/omit';

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

  handleDelete = async (event) => {
    const { isPublished, isVersion, formik } = this.props;
    const { handleSubmit } = formik;

    this.context.setSubmitContext(DepositFormSubmitActions.DELETE, {
      isDiscardingVersion: isPublished || isVersion,
    });
    handleSubmit(event);
    this.closeConfirmModal();
  };

  render() {
    const {
      draftExists,
      isPublished,
      isVersion,
      actionState,
      formik,
      ...ui // only has ActionButton props
    } = this.props;

    const { isSubmitting } = formik;

    const uiProps = _omit(ui, ['dispatch']);

    let actionLbl = '';
    if (!isPublished) {
      actionLbl = isVersion ? DISCARD_VERSION_LBL : DELETE_LBL;
    } else {
      actionLbl = DISCARD_CHANGES_LBL;
    }
    const color = isPublished ? 'warning' : 'negative' ;
    const capitalizedActionLbl = toCapitalCase(actionLbl);

    return (
      <>
        <Button
          disabled={!draftExists || isSubmitting}
          onClick={this.openConfirmModal}
          className={color}
          icon
          loading={isSubmitting && actionState === DRAFT_DELETE_STARTED}
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
            <DialogText actionLbl={actionLbl} />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeConfirmModal} floated="left">
              {i18next.t('Cancel')}
            </Button>
            <Button
              {...color}
              onClick={this.handleDelete}
              loading={isSubmitting && actionState === DRAFT_DELETE_STARTED}
              icon="trash alternate outline"
              content={capitalizedActionLbl}
            />
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
)(connectFormik(DeleteButtonComponent));
