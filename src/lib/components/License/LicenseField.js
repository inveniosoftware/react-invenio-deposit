// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

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

    /**
     * Removes license from UI object
     * @param {number} index
     */
    const removeUILicense = (index) => {
      const uiValues = getIn(values, `${uiFieldPath}`, '');
      uiValues.splice(index, 1);
    };

    /**
     * Replaces license in UI object
     * @param {number} index
     * @param {Object} selectedLicense
     */
    const replaceUILicense = (index, selectedLicense) => {
      const uiValues = getIn(values, `${uiFieldPath}`, '');
      const UIserialize = (selectedLicense) => ({
        id: selectedLicense.id,
        description_l10n: selectedLicense.description,
        title_l10n: selectedLicense.title,
        link: selectedLicense.link,
      });
      uiValues.splice(index, 1, UIserialize(selectedLicense));
    };

    return (
      <DndProvider backend={HTML5Backend}>
        <Form.Field required={required}>
          <FieldLabel
            htmlFor={fieldPath}
            icon={labelIcon}
            label={label}
          ></FieldLabel>
          <List>
            {getIn(values, fieldPath, []).map((value, index, array) => {
              const arrayPath = fieldPath;
              const indexPath = index;
              const key = `${arrayPath}.${indexPath}`;
              const uiKey = `${uiFieldPath}.${indexPath}`;
              const licenseType = value.id ? 'standard' : 'custom';
              const description = getIn(
                values,
                `${uiKey}.description_l10n`,
                getIn(values, `${key}.description`)
              );
              const link = value.id
                ? getIn(
                    values,
                    `${uiKey}.props.url`,
                    getIn(values, `${key}.props.url`, '')
                  )
                : getIn(
                    values,
                    `${uiKey}.link`,
                    getIn(values, `${key}.link`, '')
                  );
              const title = getIn(
                values,
                `${uiKey}.title_l10n`,
                getIn(values, `${key}.title`, '')
              );
              return (
                <LicenseFieldItem
                  key={key}
                  {...{
                    index,
                    licenseType,
                    compKey: key,
                    initialLicense: licenseType === 'custom' ? value : null,
                    licenseDescription: description,
                    licenseTitle: title,
                    moveLicense: formikArrayMove,
                    replaceLicense: formikArrayReplace,
                    replaceUILicense: replaceUILicense,
                    removeLicense: formikArrayRemove,
                    removeUILicense: removeUILicense,
                    searchConfig: this.props.searchConfig,
                    serializeLicenses: this.props.serializeLicenses,
                    link: link,
                  }}
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
