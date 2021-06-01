// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';

export class ArrayFieldWithVocabulary {
  constructor({
    fieldpath,
    vocabularyFieldPath,
    deserializedDefault = null,
    deserializedVocabularyDefault = null,
    serializedDefault = null,
    serializedVocabularyDefault = null,
  }) {
    this.fieldpath = fieldpath;
    this.vocabularyFieldPath = vocabularyFieldPath;
    this.deserializedDefault = deserializedDefault;
    this.deserializedVocabularyDefault = deserializedVocabularyDefault;
    this.serializedDefault = serializedDefault;
    this.serializedVocabularyDefault = serializedVocabularyDefault;
  }

  deserialize(record) {
    let fieldValue = _get(record, this.fieldpath, this.deserializedDefault);
    if (fieldValue !== null) {
      // Deserialize the vocabulary value
      fieldValue = fieldValue.map((element) => {
        let vocabularyValue = _get(
          element,
          this.vocabularyFieldPath,
          this.deserializedVocabularyDefault
        );
        if (!_isEmpty(vocabularyValue)) {
          return _set(
            _cloneDeep(element),
            this.vocabularyFieldPath,
            vocabularyValue.id
          );
        }
        return element;
      });
      return _set(_cloneDeep(record), this.fieldpath, fieldValue);
    }
    return record;
  }

  serialize(record) {
    let fieldValue = _get(record, this.fieldpath, this.serializedDefault);
    if (fieldValue !== null) {
      // Serialize the vocabulary value
      fieldValue = fieldValue.map((element) => {
        let vocabularyValue = _get(
          element,
          this.vocabularyFieldPath,
          this.serializedVocabularyDefault
        );
        if (vocabularyValue !== null) {
          return _set(
            _cloneDeep(element),
            this.vocabularyFieldPath,
            {id: vocabularyValue}
          );
        }
        return element;
      });
      return _set(_cloneDeep(record), this.fieldpath, fieldValue);
    }
    return record;
  }
}
