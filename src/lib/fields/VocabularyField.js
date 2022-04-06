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
    localeFields = [],
  }) {
    super({ fieldpath, deserializedDefault, serializedDefault });
    this.labelField = labelField;
    this.localeFields = localeFields;
  }

  /**
   * Deserializes a given record, optionally using a locale.
   * Optional argument 'locale' is used to deserialize a composite property of the record which has multiple languages support.
   * 
   * @param {object} record The record to be deserialized. 
   * @param {string} [locale="en"] A string that matches a locale. 
   * 
   * @example <caption>Deserialize a record usign a locale</caption>
   * const vocabField = new VocabularyField({fieldpath: "nation", localeFields: ["name"]})
   * vocabField.deserialize(country: {{nation: {name: {en: "Switzerland", fr: "Suisse"}}}, capital: 'Bern'}, "fr")
   * // returns {nation: {name: "Suisse"}}
   * 
   * @returns {object} Returns a deep copy of the given record, deserialized using the provided settings.
   */
  deserialize(record, locale="en") {
    /**
     * Deserializes an object. 
     * 
     * If the object contains an id, its returned as-is. 
     * If 'localeFields' is populated, each field going to be deserialized using a provided locale or a default one ("en").
     * If no locale is found within the object, the given object's clone is not mutated. Same applies for invalid locale fields.
     * 
     * @param {object} value The object to be deserialized.
     * 
     * @returns {(object|*)} Returns a clone of the given object or its 'id' property, if exists.
     */
    const _deserialize = (value) => {
      if (value?.id) {
        return value.id;
      }
      
      if (this.localeFields.length > 0){
        const clonedValue = _cloneDeep(value);
        this.localeFields.forEach((field) => {
          clonedValue[field] = value?.[field]?.[locale] || clonedValue[field];
        });
        return clonedValue;
      }

    };

    const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
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

  // TODO this might not be correct. If we are trying to serialize an object that was deserialized,
  // TODO we might have already lost other locales data.
  // TODO additionally, if the locale is changed between de/serialization we might be serializing to the wrong locale. 
  serialize(record, locale='en') {
    let fieldValue = _get(record, this.fieldpath, this.serializedDefault);
    let serializedValue = null;
    if (fieldValue !== null) {
      serializedValue = Array.isArray(fieldValue)
        ? fieldValue.map((value) => {
            if (typeof value === 'string') {
              return { id: value };
            }
            
            if (this.localeFields){
              // TODO validate this
              const serLocaleFields = this.localeFields.map((field) => {
                if (field in fieldValue) {
                  return { [field]: {
                    [locale]: fieldValue[field]
                  } };
                }
              });

              return {
                ...(value.id ? { id: value.id } : {}),
                [this.labelField]: value[this.labelField],
                ...serLocaleFields
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
  deserialize(record) {
    const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
    // We deserialize the values in the format
    // {id: 'vocab_id', <labelField>: 'vacab_name'} for controlled values
    // and {<labelField>: 'vocab_name'} for user added entries
    const _deserialize = (value) => ({
      ...(value.id ? { id: value.id } : {}),
      [this.labelField]: value[this.labelField],
    });
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