// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectField } from 'react-invenio-forms';
import { i18next } from '@translations/i18next';

export class CreatibutorsIdentifiers extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    fieldPath: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    handleChange: PropTypes.func,
    handleIdentifierAddition: PropTypes.func,
  };

  static defaultProps = {
    fieldPath: 'person_or_org.identifiers',
    label: i18next.t('Name identifiers'),
    placeholder: i18next.t('e.g. ORCID, ISNI or GND.'),
  };

  render() {
    return (
      <SelectField
        fieldPath={this.props.fieldPath}
        label={this.props.label}
        options={this.props.options}
        placeholder={this.props.placeholder}
        noResultsMessage={i18next.t('Type the value of an identifier...')}
        search
        multiple
        selection
        allowAdditions
        onChange={this.props.handleChange}
        // `icon` is set to `null` in order to hide the dropdown default icon
        icon={null}
        onAddItem={this.props.handleIdentifierAddition}
        optimized
      />
    );
  }
}
