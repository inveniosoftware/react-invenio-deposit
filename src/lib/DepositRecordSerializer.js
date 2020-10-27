// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from 'lodash/get';
import _isNumber from 'lodash/isNumber';
import _isBoolean from 'lodash/isBoolean';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _isObject from 'lodash/isObject';
import _isArray from 'lodash/isArray';
import _isNull from 'lodash/isNull';
import _pickBy from 'lodash/pickBy';
import _pick from 'lodash/pick';
import _mapValues from 'lodash/mapValues';
import { emptyCreator, emptyContributor } from './record';
import isEmpty from 'lodash/isEmpty';

export class DepositRecordSerializer {
  defaultRecord = {
    metadata: {
      title: '',
      creators: [emptyCreator],
      contributors: [emptyContributor],
      resource_type: '',
    },
    access: {
      metadata: false,
      files: false,
      owned_by: [1],
      access_right: 'open',
    },
  };

  deserializeIdentifiers(obj) {
    const in_identifiers = obj.identifiers || {};
    const identifiers = Object.keys(in_identifiers).map((identifier) => {
      return {
        scheme: identifier,
        identifier: in_identifiers[identifier],
      };
    });
    return _isEmpty(identifiers) ? obj : { ...obj, identifiers };
  }

  deserializeAffiliations(affiliations) {
    return affiliations.map((affiliation) => {
      affiliation = this.deserializeIdentifiers(affiliation);
      return affiliation;
    });
  }

  deserializeCreators(record) {
    let in_creators = _get(
      record,
      'metadata.creators',
      this.defaultRecord.metadata.creators
    );
    const creators = in_creators.map((creator) => {
      creator = this.deserializeIdentifiers(creator);
      const affiliations = this.deserializeAffiliations(
        creator.affiliations || []
      );
      if (!isEmpty(affiliations)) {
        creator.affiliations = affiliations;
      }
      return creator;
    });

    return creators;
  }

  deserializeContributors(record) {
    let in_contributors = _get(
      record,
      'metadata.contributors',
      this.defaultRecord.metadata.contributors
    );
    const contributors = in_contributors.map((contributor) => {
      contributor = this.deserializeIdentifiers(contributor);
      const affiliations = this.deserializeAffiliations(
        contributor.affiliations || []
      );
      if (!isEmpty(affiliations)) {
        contributor.affiliations = affiliations;
      }
      return contributor;
    });

    return contributors;
  }

  deserialize(record) {
    // Remove empty null values from record. This happens when we create a new
    // draft and the backend produces an empty record filled in with null values,
    // array of null values etc.
    let strippedRecord = this.removeEmptyValues(record);
    strippedRecord = _pick(strippedRecord, [
      'access',
      'metadata',
      'id',
      'links',
    ]);
    let title = _get(
      strippedRecord,
      'metadata.title',
      this.defaultRecord.metadata.title
    );
    let creators = this.deserializeCreators(strippedRecord);
    let contributors = this.deserializeContributors(strippedRecord);
    let resource_type = _get(
      strippedRecord,
      'metadata.resource_type',
      this.defaultRecord.metadata.resource_type
    );

    let access = _get(strippedRecord, 'access', this.defaultRecord.access);
    let metadata = {
      ...strippedRecord.metadata,
      title,
      creators,
      contributors,
      resource_type,
    };

    return {
      ...strippedRecord,
      access,
      metadata,
    };
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
      let filterValues = mappedValues.filter((value) => {
        if (_isBoolean(value) || _isNumber(value)) {
          return value;
        }
        return !_isEmpty(value);
      });
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
    return _isNumber(obj) || _isBoolean(obj) || obj ? obj : null;
  }

  serializeIdentifiers(obj) {
    const in_identifiers = obj.identifiers || [];
    let identifiers = in_identifiers.reduce((acc, identifier) => {
      acc[identifier.scheme] = identifier.identifier;
      return acc;
    }, {});
    return _isEmpty(identifiers) ? obj : { ...obj, identifiers };
  }

  serializeAffiliations(affiliations) {
    return affiliations.map((affiliation) => {
      affiliation = this.serializeIdentifiers(affiliation);
      return affiliation;
    });
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
    const in_creators = _get(record, 'metadata.creators', []);
    const creators = in_creators.map((creator) => {
      creator = this.serializeIdentifiers(creator);
      const affiliations = this.serializeAffiliations(
        creator.affiliations || []
      );
      if (!isEmpty(affiliations)) {
        creator.affiliations = affiliations;
      }
      return creator;
    });

    return _isEmpty(creators)
      ? record
      : { ...record, metadata: { ...record.metadata, creators } };
  }

  /**
   * Transform frontend contributors structure to API-compatible structure.
   * Strips it out if only default type is there.
   * @method
   * @param {object} record - with contributors in frontend format
   * @returns {object} record - with contributors in API format
   */
  serializeContributors(record) {
    const in_contributors = _get(record, 'metadata.contributors', []);
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
      contributor = this.serializeIdentifiers(contributor);
      const affiliations = this.serializeAffiliations(
        contributor.affiliations || []
      );
      if (!isEmpty(affiliations)) {
        contributor.affiliations = affiliations;
      }
      return contributor;
    });

    // Did we filter out / change contributors?
    if (!_isEqual(contributors, in_contributors)) {
      if (contributors.length === 0) {
        // Yes and now it is empty so we need to strip it
        delete record.metadata.contributors;
        return record;
      } else {
        // Yes and we simply restructured the identifiers
        return { ...record, metadata: { ...record.metadata, contributors } };
      }
    } else {
      return record;
    }
  }

  /**
   * Temporarily fill publication date field until frontend does it.
   * @method
   * @param {object} record - in frontend format
   * @returns {object} record - in API format
   */
  fillPublicationDate(record) {
    var todayStr = new Date().toISOString();
    let publication_date = // Using backend naming convention
      record.metadata.publication_date ||
      todayStr.slice(0, todayStr.indexOf('T'));
    let metadata = { ...record['metadata'], publication_date };
    return { ...record, metadata };
  }

  /**
   * Temporarily fill descriptions field until frontend does it.
   * @method
   * @param {object} record - in frontend format
   * @returns {object} record - in API format
   */
  fillDescriptions(record) {
    let descriptions = [
      {
        description: 'Just a filler description.',
        lang: 'eng',
        type: 'Abstract',
      },
    ];
    let metadata = { ...record['metadata'], descriptions };

    return { ...record, metadata };
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
    let strippedRecord = this.removeEmptyValues(record);
    let serializedRecord = this.serializeCreators(strippedRecord);
    serializedRecord = this.serializeContributors(serializedRecord);

    // Temporary injection of fields not covered by frontend but needed by
    // backend. As the fields get covered by frontend, remove them from here.
    // TODO: Remove when fields are implemented
    serializedRecord = this.fillPublicationDate(serializedRecord);
    serializedRecord = this.fillDescriptions(serializedRecord);

    return serializedRecord;
  }
}
