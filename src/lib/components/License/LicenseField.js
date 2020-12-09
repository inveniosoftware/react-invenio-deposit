// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';

import { Button, Form, Dropdown, List } from 'semantic-ui-react';

import { FieldLabel } from 'react-invenio-forms';
import { LicenseModal } from './LicenseModal';

export class LicenseField extends Component {
  renderFormField = (props) => {
    const {
      form: { values, errors },
      ...arrayHelpers
    } = props;
    const { fieldPath, label, labelIcon, required } = this.props;
    return (
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
            const licenseType = value.id ? 'standard' : 'custom';
            const description = getIn(values, `${key}.description`, '');
            const title = getIn(values, `${key}.title`, '');
            return (
              <List.Item key={key} className="license-listitem">
                <List.Content floated="right">
                  <LicenseModal
                    searchConfig={this.props.searchConfig}
                    onLicenseChange={(selectedLicense) => {
                      arrayHelpers.replace(indexPath, selectedLicense);
                    }}
                    mode={licenseType}
                    initialLicense={licenseType === 'custom' ? value : null}
                    action="edit"
                    trigger={
                      <Button size="mini" positive type="button">
                        Change
                      </Button>
                    }
                  />
                  <Button
                    size="mini"
                    negative
                    type="button"
                    onClick={() => arrayHelpers.remove(indexPath)}
                  >
                    Remove
                  </Button>
                </List.Content>
                <List.Content>
                  <List.Header>{title}</List.Header>
                  {description && (
                    <List.Description>{description}</List.Description>
                  )}
                </List.Content>
              </List.Item>
            );
          })}
          <Dropdown
            floating
            text="Add a license"
            icon="plus"
            labeled
            button
            className="small blue icon add-licenses"
          >
            <Dropdown.Menu>
              <LicenseModal
                searchConfig={this.props.searchConfig}
                trigger={<Dropdown.Item key="standard" text="Add standard" />}
                onLicenseChange={(selectedLicense) => {
                  arrayHelpers.push(selectedLicense);
                }}
                mode="standard"
                action="add"
              />
              <LicenseModal
                searchConfig={this.props.searchConfig}
                trigger={<Dropdown.Item key="custom" text="Create custom" />}
                onLicenseChange={(selectedLicense) => {
                  arrayHelpers.push(selectedLicense);
                }}
                mode="custom"
                action="add"
              />
            </Dropdown.Menu>
          </Dropdown>
        </List>
      </Form.Field>
    );
  };
  setOpen = (open) => this.setState({ open });

  render() {
    return (
      <FieldArray
        name={this.props.fieldPath}
        component={this.renderFormField}
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
};

LicenseField.defaultProps = {
  fieldPath: 'metadata.licenses',
  label: 'Licenses',
  labelIcon: 'drivers license',
  required: false,
};
