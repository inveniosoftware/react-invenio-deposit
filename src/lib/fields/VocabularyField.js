// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from "lodash/get";
import _set from "lodash/set";
import _cloneDeep from "lodash/cloneDeep";

import { Field } from "./Field";

export class VocabularyField extends Field {
  constructor({
    fieldpath,
    deserializedDefault = null,
    serializedDefault = null,
    labelField = "name",
  }) {
    super({ fieldpath, deserializedDefault, serializedDefault });
    this.labelField = labelField;
  }

  /**
   * Deserializes a given record.
   *
   * @param {object} record The record to be deserialized.
   *
   * @returns {object} Returns a deep copy of the given record, deserialized using the provided settings.
   */
  deserialize(record) {
    /**
     * Deserializes an object.
     *
     * If the object contains an id, its returned as-is.
     *
     * @param {object} value The object to be deserialized.
     *
     * @returns {(object|*)} Returns a clone of the given object or its 'id' property, if exists.
     */
    const _deserialize = (value) => {
      if (value?.id) {
        return value.id;
      }
    };

    const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
    let deserializedValue = null;
    if (fieldValue !== null) {
      deserializedValue = Array.isArray(fieldValue)
        ? fieldValue.map(_deserialize)
        : _deserialize(fieldValue);
    }

    return _set(_cloneDeep(record), this.fieldpath, deserializedValue || fieldValue);
  }

  serialize(record) {
    const _serialize = (value) => {
      if (typeof value === "string") {
        return { id: value };
      }

      return {
        ...(value.id ? { id: value.id } : {}),
        ...(value[this.labelField] && { [this.labelField]: value[this.labelField] }),
      };
    };

    let fieldValue = _get(record, this.fieldpath, this.serializedDefault);
    let serializedValue = null;
    if (fieldValue !== null) {
      serializedValue = Array.isArray(fieldValue)
        ? fieldValue.map(_serialize)
        : _serialize(fieldValue); // fieldValue is a string
    }

    return _set(_cloneDeep(record), this.fieldpath, serializedValue || fieldValue);
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
    return _set(_cloneDeep(record), this.fieldpath, deserializedValue || fieldValue);
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
      if ("id" in value) {
        if (typeof value.title === "string") {
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
    return _set(_cloneDeep(record), this.fieldpath, deserializedValue || fieldValue);
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
      if ("id" in value) {
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

    return _set(_cloneDeep(record), this.fieldpath, serializedValue || fieldValue);
  }
}

export class FundingField extends Field {
  constructor({ fieldpath, deserializedDefault = null, serializedDefault = null }) {
    super({ fieldpath, deserializedDefault, serializedDefault });
  }

  /**
   * Deserializes a funding record.
   *
   * @param {object} record the funding record to be deserialized.
   * @param {string} defaultLocale - The default locale
   *
   * @returns {object} the deserialized record.
   */
  deserialize(record, defaultLocale) {
    /**
     * Deserializes a record. In case the record contains a 'title' property, it will extract its 'en' property.
     *
     * @param {object} value The object to be deserialized.
     *
     * @todo record's title is deserialized reading an 'en' locale. This needs to take into account the current locale or pass that
     * responsability to backend.
     *
     * @returns {(object|*)} Returns a deep copy of the given object.
     */
    const _deserialize = (value) => {
      const deserializedValue = _cloneDeep(value);
      if (value?.title) {
        deserializedValue.title = value.title[defaultLocale];
      }

      if (value.identifiers) {
        const allowedIdentifiers = ["url"];

        allowedIdentifiers.forEach((identifier) => {
          let identifierValue = null;
          value.identifiers.forEach((v) => {
            if (v.scheme === identifier) {
              identifierValue = v.identifier;
            }
          });

          if (identifierValue) {
            deserializedValue[identifier] = identifierValue;
          }
        });

        delete deserializedValue["identifiers"];
      }
      return deserializedValue;
    };

    const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
    let deserializedValue = null;
    if (fieldValue !== null) {
      deserializedValue = Array.isArray(fieldValue)
        ? fieldValue.map(_deserialize)
        : _deserialize(fieldValue);
    }

    return _set(_cloneDeep(record), this.fieldpath, deserializedValue || fieldValue);
  }

  /**
   * Serializes a funding record.
   *
   * @param {object} record
   * @param {string} defaultLocale - The default locale
   *
   * @returns
   */
  serialize(record, defaultLocale) {
    /**
     * Serializes a record. Either returns a new object with the record's id or returns a deep copy of the record.
     *
     * @param {object} value
     *
     * @todo record's title is serialized forcing an 'en' locale. This needs to take into account the current locale or pass that
     * responsability to backend.
     *
     * @returns an object containing the record's id, if it has an 'id' property.
     */
    const _serialize = (value) => {
      if (value.id) {
        return { id: value.id };
      }

      // Record is a custom record, without explicit 'id'
      const clonedValue = _cloneDeep(value);
      if (value.title) {
        clonedValue.title = {
          [defaultLocale]: value.title,
        };
      }

      if (value.url) {
        clonedValue.identifiers = [
          {
            identifier: value.url,
            scheme: "url",
          },
        ];
        delete clonedValue["url"];
      }

      return clonedValue;
    };

    let fieldValue = _get(record, this.fieldpath, this.serializedDefault);
    let serializedValue = null;
    if (fieldValue !== null) {
      serializedValue = Array.isArray(fieldValue)
        ? fieldValue.map(_serialize)
        : _serialize(fieldValue);
    }

    return _set(_cloneDeep(record), this.fieldpath, serializedValue || fieldValue);
  }
}
