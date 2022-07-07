// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from "react";
import { connect } from "react-redux";
import { Header } from "semantic-ui-react";
import { i18next } from "@translations/i18next";
import PropTypes from "prop-types";

class DepositFormTitleComponent extends Component {
  render() {
    const { isPublished, isVersion } = this.props;

    let content = "";
    if (!isPublished) {
      content = isVersion ? i18next.t("New version") : i18next.t("New upload");
    } else {
      content = i18next.t("Edit upload");
    }
    return <Header as="h1" icon="upload" content={content} />;
  }
}

DepositFormTitleComponent.propTypes = {
  isPublished: PropTypes.bool,
  isVersion: PropTypes.bool,
};

DepositFormTitleComponent.defaultProps = {
  isPublished: false,
  isVersion: false,
};

const mapStateToProps = (state) => ({
  isPublished: state.deposit.record.is_published,
  isVersion: state.deposit.record.versions?.index > 1,
});

export const DepositFormTitle = connect(
  mapStateToProps,
  null
)(DepositFormTitleComponent);
