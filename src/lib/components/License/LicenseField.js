// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _find from 'lodash/find';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { FieldLabel } from 'react-invenio-forms';
import { Button, Form, Icon, List } from 'semantic-ui-react';

import { LicenseModal } from './LicenseModal';
import { LicenseFieldItem } from './LicenseFieldItem';
import { i18next } from '@translations/i18next';


/**
 * The user-facing license.
 *
 */
class VisibleLicense {

  /**
   * Constructor.
   *
  * @param {array} uiRights
  * @param {object} right
  * @param {int} index
  */
  constructor(uiRights, right, index) {
    this.index = index;
    this.type = right.id ? 'standard' : 'custom';
    this.key = right.id || right.title;
    this.initial = this.type === 'custom' ? right : null;

    let uiRight = _find(
      uiRights,
      right.id ? (o) => o.id === right.id : (o) => o.title === right.title
    ) || {};

    this.description = uiRight.description_l10n || right.description || "";
    this.title = uiRight.title_l10n || right.title || "";
    this.link = (
      uiRight.props && uiRight.props.url ||
      uiRight.link ||
      right.props && right.props.url ||
      right.link || ""
    );
  }
}


class LicenseFieldForm extends Component {
  render() {
    const {
      label,
      labelIcon,
      fieldPath,
      uiFieldPath,
      form: { values, errors },
      move: formikArrayMove,
      push: formikArrayPush,
      remove: formikArrayRemove,
      replace: formikArrayReplace,
      required,
    } = this.props;

    const uiRights = getIn(values, uiFieldPath, []);

    return (
      <DndProvider backend={HTML5Backend}>
        <Form.Field required={required}>
          <FieldLabel
            htmlFor={fieldPath}
            icon={labelIcon}
            label={label}
          ></FieldLabel>
          <List>
            {getIn(values, fieldPath, []).map((value, index) => {
              const license = new VisibleLicense(uiRights, value, index);
              return (
                <LicenseFieldItem
                  key={license.key}
                  license={license}
                  moveLicense={formikArrayMove}
                  replaceLicense={formikArrayReplace}
                  removeLicense={formikArrayRemove}
                  searchConfig={this.props.searchConfig}
                  serializeLicenses={this.props.serializeLicenses}
                />
              );
            })}
            <LicenseModal
              searchConfig={this.props.searchConfig}
              trigger={
                <Button type="button" key="standard">
                  <Icon name="add" />
                  {i18next.t('Add standard')}
                </Button>
              }
              onLicenseChange={(selectedLicense) => {
                formikArrayPush(selectedLicense);
              }}
              mode="standard"
              action="add"
              serializeLicenses={this.props.serializeLicenses}
            />
            <LicenseModal
              searchConfig={this.props.searchConfig}
              trigger={
                <Button type="button" key="custom">
                  <Icon name="add" />
                  {i18next.t('Add custom')}
                </Button>
              }
              onLicenseChange={(selectedLicense) => {
                formikArrayPush(selectedLicense);
              }}
              mode="custom"
              action="add"
            />
          </List>
        </Form.Field>
      </DndProvider>
    );
  }
  setOpen = (open) => this.setState({ open });
}

export class LicenseField extends Component {
  render() {
    return (
      <FieldArray
        name={this.props.fieldPath}
        component={(formikProps) => (
          <LicenseFieldForm {...formikProps} {...this.props} />
        )}
      />
    );
  }
}

LicenseField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  searchConfig: PropTypes.object.isRequired,
  required: PropTypes.bool,
  serializeLicenses: PropTypes.func,
};

LicenseField.defaultProps = {
  fieldPath: 'metadata.rights',
  label: i18next.t('Licenses'),
  uiFieldPath: 'ui.rights',
  labelIcon: 'drivers license',
  required: false,
};
