// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectField } from 'react-invenio-forms';
import _unickBy from 'lodash/unionBy';

export class CreatibutorsIdentifiers extends Component {
  static propTypes = {
    initialOptions: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    fieldPath: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    fieldPath: 'person_or_org.identifiers',
    label: 'Name identifiers',
    placeholder: 'e.g. ORCID, ISNI or GND.',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: props.initialOptions,
    };
  }

  handleIdentifierAddition = (e, { value }) => {
    this.setState((prevState) => ({
      selectedOptions: _unickBy(
        [
          {
            text: value,
            value: value,
            key: value,
          },
          ...prevState.selectedOptions,
        ],
        'value'
      ),
    }));
  };

  valuesToOptions = (options) =>
    options.map((option) => ({
      text: option,
      value: option,
      key: option,
    }));

  handleChange = ({ data, formikProps }) => {
    this.setState({
      selectedOptions: this.valuesToOptions(data.value),
    });
    formikProps.form.setFieldValue(this.props.fieldPath, data.value);
  };

  render() {
    return (
      <SelectField
        fieldPath={this.props.fieldPath}
        label={this.props.label}
        options={this.state.selectedOptions}
        placeholder={this.props.placeholder}
        noResultsMessage="Type the value of an identifier..."
        search
        multiple
        selection
        allowAdditions
        onChange={this.handleChange}
        // `icon` is set to `null` in order to hide the dropdown default icon
        icon={null}
        onAddItem={this.handleIdentifierAddition}
        optimized
      />
    );
  }
}
