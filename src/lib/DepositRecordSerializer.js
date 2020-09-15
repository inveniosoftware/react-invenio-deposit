// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _isNumber from 'lodash/isNumber';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _isObject from 'lodash/isObject';
import _isArray from 'lodash/isArray';
import _isNull from 'lodash/isNull';
import _pickBy from 'lodash/pickBy';
import _mapValues from 'lodash/mapValues';

export class DepositRecordSerializer {
  deserialize(record) {
    return record;
  }

  /**
   * Remove empty fields from record
   * @method
   * @param {object} obj - potentially empty object
   * @returns {object} record - without empty fields
   */
  removeEmptyValues(obj) {
    if (_isArray(obj)) {
      let mappedValues = obj.map((value) => this.removeEmptyValues(value));
      let filterValues = mappedValues.filter((value) => !_isEmpty(value));
      return filterValues;
    } else if (_isObject(obj)) {
      let mappedValues = _mapValues(obj, (value) =>
        this.removeEmptyValues(value)
      );
      let pickedValues = _pickBy(mappedValues, (value) => {
        if (_isArray(value) || _isObject(value)) {
          return !_isEmpty(value);
        }
        return !_isNull(value);
      });
      return pickedValues;
    }
    return _isNumber(obj) || obj ? obj : null;
  }

  /**
   * Transform frontend creators structure to API-compatible structure.
   *
   * NOTE: Serialization doesn't deal with validation: safely access properties
   * NOTE: If property absent from input, it should be absent from output
   * @method
   * @param {object} record - with creators in frontend format
   * @returns {object} record - with creators in API format
   */
  serializeCreators(record) {
    const in_creators = record.creators || [];
    const creators = in_creators.map((creator) => {
      const in_identifiers = creator.identifiers || [];
      const identifiers = in_identifiers.reduce((acc, identifier) => {
        acc[identifier.scheme] = identifier.identifier;
        return acc;
      }, {});
      return _isEmpty(identifiers) ? creator : { ...creator, identifiers };
    });

    return _isEmpty(creators) ? record : { ...record, creators };
  }

  /**
   * Transform frontend contributors structure to API-compatible structure.
   * @method
   * @param {object} record - with contributors in frontend format
   * @returns {object} record - with contributors in API format
   */
  serializeContributors(record) {
    const in_contributors = record.contributors || [];

    // Remove contributors with only a type
    // Note: we have to do this because type is filled by default, but
    // contributors is an optional field
    let contributors = in_contributors.filter((contributor) => {
      return !(
        Object.keys(contributor).length === 1 &&
        contributor.hasOwnProperty('type')
      );
    });

    // Restructure identifiers
    contributors = contributors.map((contributor) => {
      const in_identifiers = contributor.identifiers || [];
      const identifiers = in_identifiers.reduce((acc, identifier) => {
        acc[identifier.scheme] = identifier.identifier;
        return acc;
      }, {});
      return _isEmpty(identifiers)
        ? contributor
        : { ...contributor, identifiers };
    });

    // Did we filter out / change contributors?
    if (!_isEqual(contributors, in_contributors)) {
      if (contributors.length === 0) {
        // Yes and now it is empty so we need to strip it
        delete record.contributors;
        return record;
      } else {
        // Yes and we simply restructured the identifiers
        return { ...record, contributors };
      }
    } else {
      return record;
    }
  }

  /**
   * Serialize record to send to the backend.
   * @method
   * @param {object} record - in frontend format
   * @returns {object} record - in API format
   *
   * NOTE: We use a simple "manual" approach for now. If things get more
   *       complicated, we can create a serialization schema with Yup.
   */
  serialize(record) {
    let stripped_record = this.removeEmptyValues(record);
    let serialized_record = this.serializeCreators(stripped_record);
    serialized_record = this.serializeContributors(serialized_record);

    var todayStr = new Date().toISOString();
    var defaultPublicationDate = todayStr.slice(0, todayStr.indexOf('T'));

    // TODO: Remove when fields are implemented and
    // we use deposit backend API
    let _missingRecordFields = {
      _access: {
        metadata_restricted: false,
        files_restricted: false,
      },
      _owners: [1],
      _created_by: 1,
      // TODO: Remove these when fields are implemented
      // also these fields are making the record landing page
      // to fail if they don't exist
      identifiers: {
        DOI: '10.9999/rdm.9999999',
      },
      descriptions: [
        {
          description: 'Remove me',
          lang: 'eng',
          type: 'Abstract',
        },
      ],
      publication_date: defaultPublicationDate,
    };
    return { ...serialized_record, ..._missingRecordFields };
  }
}
