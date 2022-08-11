// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";

import { FieldLabel, TextField } from "react-invenio-forms";
import { i18next } from "@translations/i18next";

export class PublisherField extends Component {
  render() {
    const { fieldPath, label, labelIcon, placeholder, required } = this.props;

    return (
      <TextField
        fieldPath={fieldPath}
        helpText={i18next.t(
          "The publisher is used to formulate the citation, so consider the prominence of the role."
        )}
        label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
        placeholder={placeholder}
        required={required}
      />
    );
  }
}

PublisherField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

PublisherField.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  fieldPath: "metadata.publisher",
  label: i18next.t("Publisher"),
  labelIcon: "building outline",
  placeholder: i18next.t("Publisher"),
  required: true,
};
