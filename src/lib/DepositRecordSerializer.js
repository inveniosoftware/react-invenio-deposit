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
import {
  Field,
  ContributorsSerializer,
  CreatorsSerializer,
} from './serializers';

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
    title: new Field('metadata.title'),
    creators: new CreatorsSerializer('metadata.creators'),
    contributors: new ContributorsSerializer('metadata.contributors'),
    resource_type: new Field('metadata.resource_type'),
    access: new Field('access'),
    publication_date: new Field('metadata.publication_date'),
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

    // TODO: abstract when we integrate defaults into Fields
    deserializedRecord = this.depositRecordSchema.title.deserialize(
      deserializedRecord,
      this.defaultRecord.metadata.title
    );
    deserializedRecord = this.depositRecordSchema.creators.deserialize(
      deserializedRecord,
      this.defaultRecord.metadata.creators
    );
    deserializedRecord = this.depositRecordSchema.contributors.deserialize(
      deserializedRecord,
      this.defaultRecord.metadata.contributors
    );
    deserializedRecord = this.depositRecordSchema.resource_type.deserialize(
      deserializedRecord,
      this.defaultRecord.metadata.resource_type
    );
    deserializedRecord = this.depositRecordSchema.access.deserialize(
      deserializedRecord,
      this.defaultRecord.access
    );
    deserializedRecord = this.depositRecordSchema.publication_date.deserialize(
      deserializedRecord,
      this.defaultRecord.metadata.publication_date
    );

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
    // TODO: abstract as soon as we get another field with custom serialization
    serializedRecord = this.depositRecordSchema.creators.serialize(
      serializedRecord,
      []
    );
    serializedRecord = this.depositRecordSchema.contributors.serialize(
      serializedRecord,
      []
    );
    return serializedRecord;
  }
}
