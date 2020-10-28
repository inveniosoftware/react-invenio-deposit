// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';


export class Field {
  constructor(fieldpath) {
    this.fieldpath = fieldpath;
  }

  deserialize(record, defaultValue = null) {
    let fieldValue = _get(record, this.fieldpath, defaultValue);
    return _set(_cloneDeep(record), this.fieldpath, fieldValue);
  }

  serialize(record, defaultValue = null) {
    let fieldValue = _get(record, this.fieldpath, defaultValue);
    return _set(_cloneDeep(record), this.fieldpath, fieldValue);
  }
}
