// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';

import { Field } from './Field';

export class VocabularyField extends Field {
  constructor({
    fieldpath,
    deserializedDefault = null,
    serializedDefault = null,
    labelField = 'name',
  }) {
    super({ fieldpath, deserializedDefault, serializedDefault });
    this.labelField = labelField;
  }

  deserialize(record) {
    const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
    const _deserialize = (value) => value.id;
    let deserializedValue = null;
    if (fieldValue !== null) {
      deserializedValue = Array.isArray(fieldValue)
        ? fieldValue.map(_deserialize)
        : _deserialize(fieldValue);
    }
    return _set(
      _cloneDeep(record),
      this.fieldpath,
      deserializedValue || fieldValue
    );
  }

  serialize(record) {
    let fieldValue = _get(record, this.fieldpath, this.serializedDefault);
    let serializedValue = null;
    if (fieldValue !== null) {
      serializedValue = Array.isArray(fieldValue)
        ? fieldValue.map((value) => {
            if (typeof value === 'string') {
              return { id: value };
            } else {
              return {
                ...(value.id ? { id: value.id } : {}),
                [this.labelField]: value[this.labelField],
              };
            }
          })
        : { id: fieldValue }; // fieldValue is a string
    }

    return _set(
      _cloneDeep(record),
      this.fieldpath,
      serializedValue || fieldValue
    );
  }
}

export class AllowAdditionsVocabularyField extends VocabularyField {
  // We deserialize the values in the format
  // {id: 'vocab_id', <labelField>: 'vocab_name'} for controlled values
  // and {<labelField>: 'vocab_name'} for user added entries
  _deserialize(value) {
    return {
      ...(value.id ? { id: value.id } : {}),
      [this.labelField]: value[this.labelField],
    };
  }

  deserialize(record) {
    const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
    let deserializedValue = null;
    if (fieldValue !== null) {
      deserializedValue = Array.isArray(fieldValue)
        ? fieldValue.map((value) => this._deserialize(value, this))
        : this._deserialize(fieldValue, this);
    }
    return _set(
      _cloneDeep(record),
      this.fieldpath,
      deserializedValue || fieldValue
    );
  }
}

/**
 * Serialize and deserialize subject field that can contain vocabulary values, (which
 * need to merge scheme + subject value) and free text but sharing
 * structure with the vocabulary values
 */
export class SubjectsVocabularyField extends AllowAdditionsVocabularyField {
  // We deserialize the values in the format
  // {id: 'vocab_id', <labelField>: '(vocab_scheme) vocab_name'} for controlled values
  // and {<labelField>: 'vocab_name'} for user added entries
  _deserialize(value) {
    return {
      ...(value.id ? { id: value.id } : {}),
      [this.labelField]: value.scheme
        ? `(${value.scheme}) ` + value[this.labelField]
        : value[this.labelField],
    };
  }
}

/**
 * Serialize and deserialize rights field that can contain vocabulary values
 * and free text but sharing structure with the vocabulary values
 */
export class RightsVocabularyField extends VocabularyField {
  constructor({
    fieldpath,
    deserializedDefault = null,
    serializedDefault = null,
    localeFields = [],
  }) {
    super({ fieldpath, deserializedDefault, serializedDefault });
    this.localeFields = localeFields;
  }

  /**
   * Deserializes the values in the format:
   * {id: 'vocab_id'} for controlled vocabs and
   * {<field_name>: 'field_name', <field_descripton>: 'field_descripton', ...}
   * for user added entries
   *
   * @param {Object} record - Record to deserialize
   * @param {String} defaultLocale - The default locale
   * @returns
   */
  deserialize(record, defaultLocale) {
    const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
    const _deserialize = (value) => {
      if ('id' in value) {
        if (typeof value.title === 'string') {
          // Needed in case we pass a default value
          return value;
        }
        return { id: value.id };
      } else {
        let deserializedValue = _cloneDeep(value);
        this.localeFields.forEach((field) => {
          if (value[field]) {
            deserializedValue[field] = value[field][defaultLocale];
          }
        });
        return deserializedValue;
      }
    };
    let deserializedValue = null;
    if (fieldValue !== null) {
      deserializedValue = Array.isArray(fieldValue)
        ? fieldValue.map(_deserialize)
        : _deserialize(fieldValue);
    }
    return _set(
      _cloneDeep(record),
      this.fieldpath,
      deserializedValue || fieldValue
    );
  }

  /**
   * Serializes the values in the format:
   * {id: 'vocab_id'} for controlled vocabs and
   * {
   *    <field_name>:
   *      { '<default_locale>: 'field_name'},
   *    <field_descripton>:
   *      { <default_locale>: 'field_descripton'}
   * }
   * for user added entries
   * @param {object} record - Record to serialize
   * @param {string} defaultLocale - The default locale
   * @returns
   */
  serialize(record, defaultLocale) {
    let fieldValue = _get(record, this.fieldpath, this.serializedDefault);
    let serializedValue = null;
    const _serialize = (value) => {
      let clonedValue = _cloneDeep(value);
      if ('id' in value) {
        return { id: value.id };
      } else {
        this.localeFields.forEach((field) => {
          if (field in value) {
            clonedValue[field] = { [defaultLocale]: value[field] };
          }
        });
      }

      return clonedValue;
    };
    if (fieldValue !== null) {
      serializedValue = Array.isArray(fieldValue)
        ? fieldValue.map(_serialize)
        : _serialize(fieldValue);
    }

    return _set(
      _cloneDeep(record),
      this.fieldpath,
      serializedValue || fieldValue
    );
  }
}
