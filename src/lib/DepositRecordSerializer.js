// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _isNumber from 'lodash/isNumber';
import _isBoolean from 'lodash/isBoolean';
import _isEmpty from 'lodash/isEmpty';
import _isObject from 'lodash/isObject';
import _isArray from 'lodash/isArray';
import _isNull from 'lodash/isNull';
import _pickBy from 'lodash/pickBy';
import _pick from 'lodash/pick';
import _mapValues from 'lodash/mapValues';
import { emptyCreator, emptyContributor } from './record';
import { Field, ContributorsField, CreatorsField } from './fields';

export class DepositRecordSerializer {
  defaultRecord = {
    metadata: {
      title: '',
      creators: [emptyCreator],
      contributors: [emptyContributor],
      resource_type: '',
      publication_date: '',
    },
    access: {
      metadata: false,
      files: false,
      owned_by: [1],
      access_right: 'open',
    },
  };

  depositRecordSchema = {
    title: new Field('metadata.title', this.defaultRecord.metadata.title),
    creators: new CreatorsField(
      'metadata.creators',
      this.defaultRecord.metadata.creators,
      []
    ),
    contributors: new ContributorsField(
      'metadata.contributors',
      this.defaultRecord.metadata.contributors,
      []
    ),
    resource_type: new Field(
      'metadata.resource_type',
      this.defaultRecord.metadata.resource_type
    ),
    access: new Field('access', this.defaultRecord.access),
    publication_date: new Field(
      'metadata.publication_date',
      this.defaultRecord.metadata.publication_date
    ),
  };

  /**
   * Remove empty fields from record
   * @method
   * @param {object} obj - potentially empty object
   * @returns {object} record - without empty fields
   */
  removeEmptyValues(obj) {
    if (_isArray(obj)) {
      let mappedValues = obj.map((value) => this.removeEmptyValues(value));
      let filterValues = mappedValues.filter((value) => {
        if (_isBoolean(value) || _isNumber(value)) {
          return value;
        }
        return !_isEmpty(value);
      });
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
    return _isNumber(obj) || _isBoolean(obj) || obj ? obj : null;
  }

  deserialize(record) {
    // Remove empty null values from record. This happens when we create a new
    // draft and the backend produces an empty record filled in with null values,
    // array of null values etc.
    let deserializedRecord = this.removeEmptyValues(record);
    deserializedRecord = _pick(deserializedRecord, [
      'access',
      'metadata',
      'id',
      'links',
    ]);

    for (let key in this.depositRecordSchema) {
      deserializedRecord = this.depositRecordSchema[key].deserialize(
        deserializedRecord
      );
    }
    return deserializedRecord;
  }

  /**
   * Serialize record to send to the backend.
   * @method
   * @param {object} record - in frontend format
   * @returns {object} record - in API format
   *
   */
  serialize(record) {
    let serializedRecord = this.removeEmptyValues(record);

    for (let key in this.depositRecordSchema) {
      serializedRecord = this.depositRecordSchema[key].serialize(
        serializedRecord
      );
    }
    return serializedRecord;
  }
}
