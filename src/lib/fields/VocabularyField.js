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
  deserialize(record) {
    let fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
    if (fieldValue !== null) {
      const value = (
        Array.isArray(fieldValue)
        ? fieldValue.map((value) => value.id || value.title)
        : (fieldValue.id || fieldValue)  // resource type is the only case
                                         // falling in this branch and we don't
                                         // rely on title for id.
      );
      return _set(
        _cloneDeep(record),
        this.fieldpath,
        value
      );
    }
    return record;
  }

  serialize(record) {
    // TODO: serializedDefault should be in output format, not input format
    let fieldValue = _get(record, this.fieldpath, this.serializedDefault);
    if (fieldValue !== null) {
      const value = (
        Array.isArray(fieldValue)
        ? fieldValue.map((value) => ({ id: value }))
        : {id: fieldValue}
      );
      return _set(
        _cloneDeep(record),
        this.fieldpath,
        value
      );
    }
    return record;
  }
}
