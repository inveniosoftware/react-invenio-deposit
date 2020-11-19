// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import _set from 'lodash/set';

import { Field } from './Field';

export class CreatibutorsField extends Field {
  /**
   * Transform backend "identifiers" value to frontend-compatible one.
   * @method
   * @param {object} identifiers - in API format
   * @returns {array} identifiers - in frontend (Formik) format
   */
  deserializeIdentifiers(identifiers) {
    return Object.keys(identifiers).map((scheme) => {
      return {
        scheme: scheme,
        identifier: identifiers[scheme],
      };
    });
  }

  /**
   * Transform backend "affiliations" value to frontend-compatible one.
   * @method
   * @param {array} affiliations - in API format
   * @returns {array} affiliations - in frontend (Formik) format
   */
  deserializeAffiliations(affiliations) {
    return affiliations.map((affiliation) => {
      affiliation.identifiers = this.deserializeIdentifiers(
        affiliation.identifiers || {}
      );
      return affiliation;
    });
  }

  /**
   * Transform backend creatibutor value to frontend-compatible one.
   * @method
   * @param {array} creatibutors - in API format
   * @returns {array} creatibutors - in frontend (Formik) format
   */
  deserializeCreatibutors(creatibutors) {
    return creatibutors.map((creatibutor) => {
      creatibutor.identifiers = this.deserializeIdentifiers(
        creatibutor.identifiers || {}
      );
      creatibutor.affiliations = this.deserializeAffiliations(
        creatibutor.affiliations || []
      );
      return creatibutor;
    });
  }

  /**
   * Transform backend creatibutor structure to frontend-compatible structure.
   * NOTE: This assumes the passed record is a copy of the original source.
   *       This method modifies the passed record.
   * @method
   * @param {object} record - in API format
   * @returns {object} record - in frontend (Formik) format
   */
  deserialize(record) {
    let backendValue = _get(record, this.fieldpath);
    let frontendValue = (
      backendValue ?
      this.deserializeCreatibutors(backendValue) : this.deserializedDefault
    );
    return _set(record, this.fieldpath, frontendValue);
  }

  /** Serialization **/

  /**
   * Transform frontend "identifiers" value to API-compatible one.
   * @method
   * @param {array} identifiers - in frontend (Formik) format
   * @returns {object} identifiers - in API format
   */
  serializeIdentifiers(identifiers) {
    return identifiers.reduce((acc, identifier) => {
      acc[identifier.scheme] = identifier.identifier;
      return acc;
    }, {});
  }

  /**
   * Transform frontend "affiliations" value to API-compatible one.
   * @method
   * @param {array} affiliations - in frontend (Formik) format
   * @returns {array} affiliations - in API format
   */
  serializeAffiliations(affiliations) {
    return affiliations.map((affiliation) => {
      affiliation.identifiers = this.serializeIdentifiers(
        affiliation.identifiers
      );
      return affiliation;
    });
  }

  /**
   * Transform frontend creatibutors value to API-compatible one.
   * Strips it out if only default type is there.
   * @method
   * @param {array} creatibutors - in frontend (Formik) format
   * @returns {array} creatibutors - in API format
   */
  serializeCreatibutors(creatibutors) {
    return creatibutors.map((creatibutor) => {
      creatibutor.identifiers = this.serializeIdentifiers(
        creatibutor.identifiers || []
      );
      creatibutor.affiliations = this.serializeAffiliations(
        creatibutor.affiliations || []
      );
      return creatibutor;
    });
  }

  /**
   * Transform frontend creatibutors structure to API-compatible structure.
   * NOTE: This assumes the passed record is a copy of the original source.
   *       This method modifies the passed record.
   * @method
   * @param {object} record - in frontend (Formik) format
   * @returns {object} record - in API format
   */
  serialize(record) {
    const frontendValue = _get(
      record,
      this.fieldpath,
      this.serializedDefault
    );

    // Remove creatibutors with only a `type`
    // We have to do this because `type` is filled by default
    let creatibutors = frontendValue.filter((creatibutor) => {
      // NOTE:
      //   * other fields are removed by `this.removeEmptyValues(record);`
      //     in `DepositRecordSerializer.js`
      //   * you CANT do this: Object.keys(creatibutor) !== ['type'] in JS
      return !_isEqual(Object.keys(creatibutor), ['type']);
    });
    creatibutors = this.serializeCreatibutors(creatibutors);
    return _set(record, this.fieldpath, creatibutors);
  }

}
