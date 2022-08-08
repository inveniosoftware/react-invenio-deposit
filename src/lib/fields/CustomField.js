// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
import _isArray from 'lodash/isArray';
import { Field } from './Field';

export class CustomField extends Field {
  constructor({
    fieldpath,
    deserializedDefault = null,
    serializedDefault = null,
    allowEmpty = false,
    vocabularyFields = [],
  }) {
    super({ fieldpath, deserializedDefault, serializedDefault, allowEmpty });
    this.vocabularyFields = vocabularyFields;
  }

  _mapCustomFields(record, customFields, mapValue) {
    if (customFields !== null) {
      for (const [key, value] of Object.entries(customFields)) {
        if (this.vocabularyFields.includes(key)) {
          let _value;
          if (_isArray(value)) {
            _value = value.map(mapValue);
          } else {
            _value = mapValue(value);
          }
          record = _set(record, `custom_fields.${key}`, _value);
        } else {
          record = _set(record, `custom_fields.${key}`, value);
        }
      }
    }
  }

  deserialize(record) {
    const _deserialize = (value) => {
      if (value?.id) {
        return value.id;
      }
    };
    let _record = _cloneDeep(record);
    let customFields = _get(record, this.fieldpath, this.deserializedDefault);
    this._mapCustomFields(_record, customFields, _deserialize);
    return _record;
  }

  serialize(record) {
    const _serialize = (value) => {
      if (typeof value === 'string') {
        return { id: value };
      }
    };
    let _record = _cloneDeep(record);
    let customFields = _get(record, this.fieldpath, this.serializedDefault);
    this._mapCustomFields(_record, customFields, _serialize);
    return _record;
  }
}
