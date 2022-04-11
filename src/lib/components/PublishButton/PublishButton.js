// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActionButton } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Button, Icon, Modal } from 'semantic-ui-react';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../../DepositFormSubmitContext';
import { DRAFT_PUBLISH_STARTED } from '../../state/types';

class PublishButtonComponent extends Component {
  static contextType = DepositFormSubmitContext;
  state = { isConfirmModalOpen: false };

  openConfirmModal = () => this.setState({ isConfirmModalOpen: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpen: false });

  handlePublish = (event, formik, publishWithoutCommunity) => {
    this.context.setSubmitContext(
      publishWithoutCommunity
        ? DepositFormSubmitActions.PUBLISH_WITHOUT_COMMUNITY
        : DepositFormSubmitActions.PUBLISH
    );
    formik.handleSubmit(event);
    this.closeConfirmModal();
  };

  isDisabled = (formik, numberOfFiles) => {
    const filesEnabled = _get(formik.values, 'files.enabled', false);
    const filesMissing = filesEnabled && !numberOfFiles;
    return formik.isSubmitting || filesMissing;
  };

  render() {
    const {
      actionState,
      publishClick,
      numberOfFiles,
      buttonLabel,
      publishWithoutCommunity,
      publishWarning,
      ...uiProps
    } = this.props;
    const { isConfirmModalOpen } = this.state;
    const modalText =
      i18next.t(publishWarning) ||
      PublishButtonComponent.defaultProps.publishWarning;

    return (
      <>
        <ActionButton
          isDisabled={(formik) => this.isDisabled(formik, numberOfFiles)}
          name="publish"
          onClick={this.openConfirmModal}
          positive
          icon
          labelPosition="left"
          {...uiProps}
        >
          {(formik) => (
            <>
              {formik.isSubmitting && actionState === DRAFT_PUBLISH_STARTED ? (
                <Icon size="large" loading name="spinner" />
              ) : (
                <Icon name="upload" />
              )}
              {buttonLabel}
            </>
          )}
        </ActionButton>
        {isConfirmModalOpen && (
          <Modal
            open={isConfirmModalOpen}
            onClose={this.closeConfirmModal}
            size="small"
            closeIcon={true}
            closeOnDimmerClick={false}
          >
            <Modal.Header>
              {i18next.t('Are you sure you want to publish this record?')}
            </Modal.Header>
            {/* the modal text should only ever come from backend configuration */}
            <Modal.Content dangerouslySetInnerHTML={{ __html: modalText }} />
            <Modal.Actions>
              <Button onClick={this.closeConfirmModal} floated="left">
                {i18next.t('Cancel')}
              </Button>
              <ActionButton
                name="publish"
                onClick={(event, formik) =>
                  this.handlePublish(event, formik, publishWithoutCommunity)
                }
                positive
                content={buttonLabel}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    );
  }
}

PublishButtonComponent.propTypes = {
  publishWarning: PropTypes.string,
  buttonLabel: PropTypes.string,
  publishWithoutCommunity: PropTypes.bool,
};

PublishButtonComponent.defaultProps = {
  publishWarning: i18next.t(
    'Once the record is published you will no longer be able to change the files in the upload!'
  ),
  buttonLabel: i18next.t('Publish'),
  publishWithoutCommunity: false,
};

const mapStateToProps = (state) => ({
  actionState: state.deposit.actionState,
  numberOfFiles: Object.values(state.files.entries).length,
});

export const PublishButton = connect(
  mapStateToProps,
  null
)(PublishButtonComponent);
