// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  TextField,
  GroupField,
  ArrayField,
  FieldLabel,
  SelectField,
} from 'react-invenio-forms';
import { Button, Form, Icon } from 'semantic-ui-react';

import { emptyRelatedWork } from '../record';
import { ResourceTypeField } from './ResourceTypeField';
import { i18next } from '@translations/i18next';

export class RelatedWorksField extends Component {
  render() {
    const { fieldPath, label, labelIcon, required, options } = this.props;

    return (
      <>
        <label className="helptext" style={{ marginBottom: '10px' }}>
          {i18next.t(
            'Specify identifiers of related works. Supported identifiers include DOI, Handle, ARK, PURL, ISSN, ISBN, PubMed ID, PubMed Central ID, ADS Bibliographic Code, arXiv, Life Science Identifiers (LSID), EAN-13, ISTC, URNs, and URLs.'
          )}
        </label>
        <ArrayField
          addButtonLabel={i18next.t('Add related work')}
          defaultNewValue={emptyRelatedWork}
          fieldPath={fieldPath}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          required={required}
        >
          {({ array, arrayHelpers, indexPath, key }) => (
            <GroupField optimized>
              <SelectField
                clearable
                fieldPath={`${key}.relation_type`}
                label={i18next.t('Relation')}
                optimized
                options={options.relations}
                placeholder={i18next.t('Select relation...')}
                required
                width={3}
              />
              
              <TextField
                fieldPath={`${key}.identifier`}
                label={i18next.t('Identifier')}
                required
                width={4}
              />

              <SelectField
                clearable
                fieldPath={`${key}.scheme`}
                label={i18next.t('Scheme')}
                optimized
                options={options.scheme}
                required
                width={2}
              />

              <ResourceTypeField
                clearable
                fieldPath={`${key}.resource_type`}
                labelIcon={''} // Otherwise breaks alignment
                options={options.resource_type}
                width={6}
                labelclassname="small field-label-class"
              />

              <Form.Field width={1}>
                <label>&nbsp;</label>
                <Button icon onClick={() => arrayHelpers.remove(indexPath)}>
                  <Icon name="close" />
                </Button>
              </Form.Field>
            </GroupField>
          )}
        </ArrayField>
      </>
    );
  }
}

RelatedWorksField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
};

RelatedWorksField.defaultProps = {
  fieldPath: 'metadata.related_identifiers',
  label: i18next.t('Related works'),
  labelIcon: 'barcode',
};
