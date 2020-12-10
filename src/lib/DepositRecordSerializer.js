// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _cloneDeep from 'lodash/cloneDeep';
import _isNumber from 'lodash/isNumber';
import _isBoolean from 'lodash/isBoolean';
import _isEmpty from 'lodash/isEmpty';
import _isObject from 'lodash/isObject';
import _isArray from 'lodash/isArray';
import _isNull from 'lodash/isNull';
import _pickBy from 'lodash/pickBy';
import _pick from 'lodash/pick';
import _mapValues from 'lodash/mapValues';
import {
  emptyCreatibutor,
  emptyDate,
  emptyFunding,
  emptyIdentifier,
  emptyRelatedIdentifier,
} from './record';
import {
  CreatibutorsField,
  DatesField,
  Field,
  VocabularyField,
} from './fields';

export class DepositRecordSerializer {
  depositRecordSchema = {
    files: new Field({
      fieldpath: 'files',
    }),
    links: new Field({
      fieldpath: 'links',
    }),
    title: new Field({
      fieldpath: 'metadata.title',
      deserializedDefault: '',
    }),
    additional_titles: new Field({
      fieldpath: 'metadata.additional_titles',
      deserializedDefault: [],
    }),
    creators: new CreatibutorsField({
      fieldpath: 'metadata.creators',
      deserializedDefault: [emptyCreatibutor],
      serializedDefault: [],
    }),
    contributors: new CreatibutorsField({
      fieldpath: 'metadata.contributors',
      deserializedDefault: [emptyCreatibutor],
      serializedDefault: [],
    }),
    resource_type: new Field({
      fieldpath: 'metadata.resource_type',
      deserializedDefault: '',
    }),
    access: new Field({
      fieldpath: 'access',
      deserializedDefault: {
        metadata: false,
        files: false,
        owned_by: [1],
        access_right: 'open',
      },
    }),
    publication_date: new Field({
      fieldpath: 'metadata.publication_date',
      deserializedDefault: '',
    }),
    dates: new DatesField({
      fieldpath: 'metadata.dates',
      deserializedDefault: [emptyDate],
    }),
    languages: new VocabularyField({
      fieldpath: 'metadata.languages',
      deserializedDefault: [],
    }),
    identifiers: new Field({
      fieldpath: 'metadata.identifiers',
      deserializedDefault: [emptyIdentifier],
    }),
    related_identifiers: new Field({
      fieldpath: 'metadata.related_identifiers',
      deserializedDefault: [emptyRelatedIdentifier],
    }),
    subjects: new VocabularyField({
      fieldpath: 'metadata.subjects',
      deserializedDefault: [],
    }),
    funding: new Field({
      fieldpath: 'metadata.funding',
      deserializedDefault: [emptyFunding],
    }),
    version: new Field({
      fieldpath: 'metadata.version',
      deserializedDefault: '',
    }),
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

  /**
   * Deserialize backend record into format compatible with frontend.
   * @method
   * @param {object} obj - potentially empty object
   * @returns {object} record - without empty fields
   */
  deserialize(record) {
    // NOTE: cloning nows allows us to manipulate the copy with impunity without
    //       affecting the original
    record = _cloneDeep(record);
    // Remove empty null values from record. This happens when we create a new
    // draft and the backend produces an empty record filled in with null
    // values, array of null values etc.
    // TODO: Backend should not attempt to provide empty values. It should just
    //       return existing record in case of edit or {} in case of new.
    let deserializedRecord = this.removeEmptyValues(record);
    deserializedRecord = _pick(deserializedRecord, [
      'access',
      'metadata',
      'id',
      'links',
      'files',
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
    // NOTE: cloning nows allows us to manipulate the copy with impunity without
    //       affecting the original
    record = _cloneDeep(record);
    let serializedRecord = this.removeEmptyValues(record);
    serializedRecord = _pick(serializedRecord, [
      'access',
      'metadata',
      'id',
      'links',
      'defaultFilePreview',
    ]);
    for (let key in this.depositRecordSchema) {
      serializedRecord = this.depositRecordSchema[key].serialize(
        serializedRecord
      );
    }
    // Remove empty values again because serialization may add some back
    return this.removeEmptyValues(serializedRecord);
  }
}
