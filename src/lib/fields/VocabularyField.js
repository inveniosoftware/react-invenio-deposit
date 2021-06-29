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
    labelField = 'title',
  }) {
    super({fieldpath, deserializedDefault, serializedDefault})
    this.labelField = labelField
  }

  deserialize(record) {
    const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
    let deserializedValue = null
    if (fieldValue !== null) {
      deserializedValue = (
        Array.isArray(fieldValue)
        ? fieldValue.map((value) => value.id || _get(value, this.labelField))
        : (fieldValue.id ||  _get(fieldValue, this.labelField))  // resource type is the only case
                                         // falling in this branch and we don't
                                         // rely on title for id.
      );
    }

    return _set(_cloneDeep(record), this.fieldpath, deserializedValue || fieldValue);
  }

  serialize(record) {
    let fieldValue = _get(record, this.fieldpath, this.serializedDefault);
    let serializedValue = null
    if (fieldValue !== null) {
      serializedValue = (
        Array.isArray(fieldValue)
        ? fieldValue.map((value) => ({ id: value }))
        : {id: fieldValue}
      );
    }

    return _set(_cloneDeep(record), this.fieldpath, serializedValue || fieldValue);
  }
}
