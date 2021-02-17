// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { FastField } from 'formik';


class ProtectionButtonsComponent extends Component {
  /**
   * Returns the props for a protection button.
   * @param active is button active
   * @param activeColor button color when active
   */
  getButtonProps(active, activeColor) {
    let props = {active};
    if (active) {
      props["color"] = activeColor;
    }
    return props;
  }

  render() {
    const {
      fieldPath,
      formik,
      active,
    } = this.props;

    return (
      <Button.Group widths={'2'}>
        <Button
          {...this.getButtonProps(active, "green")}
          onClick={(event, data) => {
            formik.form.setFieldValue(fieldPath, "public");
            // NOTE: We reset values, so if embargo filled and click Public,
            //       user needs to fill embargo again. Otherwise lots of
            //       bookkeeping.
            formik.form.setFieldValue("access.embargo", {
              active: false
            });
          }}
          compact
          attached
        >
          Public
        </Button>
        <Button
          {...this.getButtonProps(!active, "red")}
          onClick={(event, data) => formik.form.setFieldValue(fieldPath, "restricted")}
          compact
          attached
        >
          Restricted
        </Button>

      </Button.Group>
    );
  }
}


export class ProtectionButtons extends Component {
  render() {
    const {
      fieldPath,
    } = this.props;

    return <FastField
      name={fieldPath}
      component={(formikProps) => (
        <ProtectionButtonsComponent formik={formikProps} {...this.props} />
      )}
    />;
  }
}
