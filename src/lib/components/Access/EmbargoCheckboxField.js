// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import { Checkbox } from 'semantic-ui-react';
import { FastField } from 'formik';

import { EmbargoState } from './Embargo';


class EmbargoCheckboxComponent extends Component {

  render() {
    const {
      fieldPath,
      formik,
      embargo
    } = this.props;

    return <Checkbox
      id={fieldPath}
      disabled={embargo.is(EmbargoState.DISABLED)}
      checked={embargo.is(EmbargoState.APPLIED)}
      onChange={
        (event, data) => {
          if (formik.field.value) {
            // NOTE: We reset values, so if embargo filled and user unchecks,
            //       user needs to fill embargo again. Otherwise lots of
            //       bookkeeping.
            formik.form.setFieldValue("access.embargo", {
              active: false
            });
          } else {
            formik.form.setFieldValue(fieldPath, true);
          }
        }
      }
    />;
  }
}

export class EmbargoCheckboxField extends Component {
  render() {
    // NOTE: See the optimization pattern on AccessRightField for more details.
    //       This makes FastField only render when the things
    //       (access.embargo.active and embargo) it cares about change as it
    //       should be.
    const change = (
      this.props.embargo.is(EmbargoState.DISABLED) ? {} : {change: true}
    );
    return <FastField
      name={this.props.fieldPath}
      component={
        (formikProps) => (
          <EmbargoCheckboxComponent formik={formikProps} {...this.props} />
        )
      }
      {...change}
    />;
  }
}
