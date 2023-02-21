// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/i18next";
import { connect as connectFormik } from "formik";
import _get from "lodash/get";
import _omit from "lodash/omit";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon, Message, Modal } from "semantic-ui-react";
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from "../../DepositFormSubmitContext";
import { DRAFT_PUBLISH_STARTED } from "../../state/types";

class PublishButtonComponent extends Component {
  state = { isConfirmModalOpen: false };

  static contextType = DepositFormSubmitContext;

  openConfirmModal = () => this.setState({ isConfirmModalOpen: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpen: false });

  handlePublish = (event, handleSubmit, publishWithoutCommunity) => {
    const { setSubmitContext } = this.context;

    setSubmitContext(
      publishWithoutCommunity
        ? DepositFormSubmitActions.PUBLISH_WITHOUT_COMMUNITY
        : DepositFormSubmitActions.PUBLISH
    );
    handleSubmit(event);
    this.closeConfirmModal();
  };

  isDisabled = (values, isSubmitting, numberOfFiles) => {
    const filesEnabled = _get(values, "files.enabled", false);
    const filesMissing = filesEnabled && !numberOfFiles;
    return isSubmitting || filesMissing;
  };

  render() {
    const {
      actionState,
      numberOfFiles,
      buttonLabel,
      publishWithoutCommunity,
      formik,
      publishModalExtraContent,
      ...ui
    } = this.props;
    const { isConfirmModalOpen } = this.state;
    const { values, isSubmitting, handleSubmit } = formik;

    const uiProps = _omit(ui, ["dispatch"]);

    return (
      <>
        <Button
          disabled={this.isDisabled(values, isSubmitting, numberOfFiles)}
          name="publish"
          onClick={this.openConfirmModal}
          positive
          icon="upload"
          loading={isSubmitting && actionState === DRAFT_PUBLISH_STARTED}
          labelPosition="left"
          content={buttonLabel}
          {...uiProps}
          type="button" // needed so the formik form doesn't handle it as submit button i.e enable HTML validation on required input fields
        />
        {isConfirmModalOpen && (
          <Modal
            open={isConfirmModalOpen}
            onClose={this.closeConfirmModal}
            size="small"
            closeIcon
            closeOnDimmerClick={false}
          >
            <Modal.Header>
              {i18next.t("Are you sure you want to publish this record?")}
            </Modal.Header>
            {/* the modal text should only ever come from backend configuration */}
            <Modal.Content>
              <Message visible warning>
                <p>
                  <Icon name="warning sign" />{" "}
                  {i18next.t(
                    "Once the record is published you will no longer be able to change the files in the upload! However, you will still be able to update the record's metadata later."
                  )}
                </p>
              </Message>
              {publishModalExtraContent && (
                <div dangerouslySetInnerHTML={{ __html: publishModalExtraContent }} />
              )}
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeConfirmModal} floated="left">
                {i18next.t("Cancel")}
              </Button>
              <Button
                onClick={(event) =>
                  this.handlePublish(event, handleSubmit, publishWithoutCommunity)
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
  buttonLabel: PropTypes.string,
  publishWithoutCommunity: PropTypes.bool,
  actionState: PropTypes.string,
  numberOfFiles: PropTypes.number.isRequired,
  formik: PropTypes.object.isRequired,
  publishModalExtraContent: PropTypes.string,
};

PublishButtonComponent.defaultProps = {
  buttonLabel: i18next.t("Publish"),
  publishWithoutCommunity: false,
  actionState: undefined,
  publishModalExtraContent: undefined,
};

const mapStateToProps = (state) => ({
  actionState: state.deposit.actionState,
  numberOfFiles: Object.values(state.files.entries).length,
  publishModalExtraContent: state.deposit.config.publish_modal_extra,
});

export const PublishButton = connect(
  mapStateToProps,
  null
)(connectFormik(PublishButtonComponent));
