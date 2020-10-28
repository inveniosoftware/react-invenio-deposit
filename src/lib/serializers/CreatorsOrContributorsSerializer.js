// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import { Field } from './Field';

class CreatorsOrContributorsSerializer extends Field {
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

  deserializeCreatorsOrContributors(creatorsOrContributors) {
    return creatorsOrContributors.map((creatorsOrContributor) => {
      creatorsOrContributor = this.deserializeIdentifiers(
        creatorsOrContributor
      );
      const affiliations = this.deserializeAffiliations(
        creatorsOrContributor.affiliations || []
      );
      if (!_isEmpty(affiliations)) {
        creatorsOrContributor.affiliations = affiliations;
      }
      return creatorsOrContributor;
    });
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

  serializeCreatorsOrContributors(creatorsOrContributors) {
    return creatorsOrContributors.map((creatorsOrContributor) => {
      creatorsOrContributor = this.serializeIdentifiers(creatorsOrContributor);
      const affiliations = this.serializeAffiliations(
        creatorsOrContributor.affiliations || []
      );
      if (!_isEmpty(affiliations)) {
        creatorsOrContributor.affiliations = affiliations;
      }
      return creatorsOrContributor;
    });
  }
}

export class CreatorsSerializer extends CreatorsOrContributorsSerializer {
  deserialize(record, defaultValue) {
    let creators = _get(record, this.fieldpath, defaultValue);
    creators = this.deserializeCreatorsOrContributors(creators);
    return { ...record, metadata: { ...record.metadata, creators } };
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
  serialize(record, defaultValue) {
    let creators = _get(record, this.fieldpath, defaultValue);
    creators = this.serializeCreatorsOrContributors(creators);
    return _isEmpty(creators)
      ? record
      : { ...record, metadata: { ...record.metadata, creators } };
  }
}

export class ContributorsSerializer extends CreatorsOrContributorsSerializer {
  deserialize(record, defaultValue) {
    let contributors = _get(record, this.fieldpath, defaultValue);
    contributors = this.deserializeCreatorsOrContributors(contributors);
    return { ...record, metadata: { ...record.metadata, contributors } };
  }

  /**
   * Transform frontend contributors structure to API-compatible structure.
   * Strips it out if only default type is there.
   * @method
   * @param {object} record - with contributors in frontend format
   * @returns {object} record - with contributors in API format
   */
  serialize(record, defaultValue) {
    const recordContributors = _get(record, this.fieldpath, defaultValue);
    // Remove contributors with only a type
    // Note: we have to do this because type is filled by default, but
    // contributors is an optional field
    let contributors = recordContributors.filter((contributor) => {
      return !(
        Object.keys(contributor).length === 1 &&
        contributor.hasOwnProperty('type')
      );
    });
    contributors = this.serializeCreatorsOrContributors(contributors);
    // Did we filter out / change contributors?
    if (!_isEqual(contributors, recordContributors)) {
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
}
