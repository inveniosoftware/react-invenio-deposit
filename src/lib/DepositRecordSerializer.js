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

  serialize(record) {
    let stripped_record = this.removeEmptyValues(record);
    // TODO: Remove when fields are implemented and
    // we use deposit backend API
    let _missingRecordFields = {
      _access: {
        metadata_restricted: false,
        files_restricted: false,
      },
      _owners: [1],
      _created_by: 1,
      contributors: [],
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
    return { ...stripped_record, ..._missingRecordFields };
  }
}
