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

class CreatorsOrContributorsField extends Field {
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

export class CreatorsField extends CreatorsOrContributorsField {
  deserialize(record) {
    let creators = _get(record, this.fieldpath, this.defaultDeserializedValue);
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
  serialize(record) {
    let creators = _get(record, this.fieldpath, this.defaultSerializedValue);
    creators = this.serializeCreatorsOrContributors(creators);
    return _isEmpty(creators)
      ? record
      : { ...record, metadata: { ...record.metadata, creators } };
  }
}

export class ContributorsField extends CreatorsOrContributorsField {
  deserialize(record) {
    let contributors = _get(
      record,
      this.fieldpath,
      this.defaultDeserializedValue
    );
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
  serialize(record) {
    const recordContributors = _get(
      record,
      this.fieldpath,
      this.defaultSerializedValue
    );
    let contributors = this.serializeCreatorsOrContributors(recordContributors);
    return _isEmpty(contributors)
      ? record
      : { ...record, metadata: { ...record.metadata, contributors } };
  }
}
