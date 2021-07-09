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
