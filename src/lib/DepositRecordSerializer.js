// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _isNumber from 'lodash/isNumber';
import _isEmpty from 'lodash/isEmpty';
import _isObject from 'lodash/isObject';
import _isArray from 'lodash/isArray';
import _isNull from 'lodash/isNull';
import _pickBy from 'lodash/pickBy';
import _mapValues from 'lodash/mapValues';

export class DepositRecordSerializer {
  constructor() {
    this.removeEmptyValues = this.removeEmptyValues.bind(this);
  }
  deserialize(record) {
    return record;
  }

  removeEmptyValues(obj) {
    if (_isArray(obj)) {
      let mappedValues = obj.map((value) => this.removeEmptyValues(value));
      let filterValues = mappedValues.filter((value) => !_isEmpty(value));
      return filterValues;
    } else if (_isObject(obj)) {
      let mappedValues = _mapValues(obj, (value) =>
        this.removeEmptyValues(value)
      );
      let pickedValues = _pickBy(mappedValues, (value) => {
        if (_isArray(value) || _isObject(value)) {
          return !_isEmpty(value);
        }
        return !_isNull(value);
      });
      return pickedValues;
    }
    return _isNumber(obj) || obj ? obj : null;
  }

  serializeCreators(record) {
    const creators = record.creators.map((creator) => {
      const identifiers = creator.identifiers.reduce((acc, identifier) => {
        acc[identifier.scheme] = identifier.identifier;
        return acc;
      }, {});
      return {...creator, identifiers};
    });

    return {...record, creators};
  }

  serializeContributors(record) {
    const contributors = record.contributors.map((contributor) => {
      const identifiers = contributor.identifiers.reduce((acc, identifier) => {
        acc[identifier.scheme] = identifier.identifier;
        return acc;
      }, {});
      return {...contributor, identifiers};
    });

    return {...record, contributors};
  }

  serialize(record) {
    /**Serialize record to send to the backend.
     *
     * NOTE: We use a simple "manual" approach for now. If things get more
     *       complicated, we can create a serialization schema with Yup.
     */
    let stripped_record = this.removeEmptyValues(record);
    let serialized_record = this.serializeCreators(stripped_record);
    serialized_record = this.serializeContributors(serialized_record);

    // TODO: Remove when fields are implemented and
    // we use deposit backend API
    let _missingRecordFields = {
      _access: {
        metadata_restricted: false,
        files_restricted: false,
      },
      _owners: [1],
      _created_by: 1,
      // TODO: Remove these when fields are implemented
      // also these fields are making the record landing page
      // to fail if they don't exist
      identifiers: {
        DOI: '10.9999/rdm.9999999',
      },
      descriptions: [
        {
          description: 'Remove me',
          lang: 'eng',
          type: 'Abstract',
        },
      ]
    };
    return { ...serialized_record, ..._missingRecordFields };
  }
}
