// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _cloneDeep from 'lodash/cloneDeep';
import _get from 'lodash/get';
import _pick from 'lodash/pick';
import _set from 'lodash/set';
import { Field } from './Field';


export class SchemaField extends Field {
  /**
   * IMPORTANT: This component is so far only thought for list, since
   * the use case of a single object with schema has not rose yet.
   */
  constructor({
    fieldpath,
    schema,
    deserializedDefault = [],
    serializedDefault = [],
  }) {
    super({fieldpath, deserializedDefault, serializedDefault})
    this.schema = schema
    this.schemaKeys = Object.keys(this.schema)
  };

  /**
   * Deserialize backend field into format compatible with frontend using
   * the given schema. 
   * @method
   * @param {object} element - potentially empty object
   * @returns {object} frontend compatible element object
   */
  deserialize(elements) {
    const fieldValues = _get(elements, this.fieldpath, this.deserializedDefault);
    const deserializedElements = fieldValues.map((value) => {
      let deserializedElement = _pick(value, this.schemaKeys);
      this.schemaKeys.forEach((key) => {
        deserializedElement = this.schema[key].deserialize(
          deserializedElement
        );
      });
      return deserializedElement
    });

    return _set(_cloneDeep(elements), this.fieldpath, deserializedElements)
    }

  /**
   * Serialize element to send to the backend.
   * @method
   * @param {object} element - in frontend format
   * @returns {object} element - in API format
   *
   */
  serialize(elements) {
    const fieldValues = _get(elements, this.fieldpath, this.serializedDefault);
    const serializedElements = fieldValues.map((value) => {
      let serializedElement = _pick(value, this.schemaKeys);
      this.schemaKeys.forEach((key) => {
        serializedElement = this.schema[key].serialize(
          serializedElement
        );
      });
      return serializedElement
    });
    if (serializedElements !== null) {
      return _set(_cloneDeep(elements), this.fieldpath, serializedElements);
    }
    return elements;
  }
}
