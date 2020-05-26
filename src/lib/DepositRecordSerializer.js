// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _ from 'lodash';

export class DepositRecordSerializer {
  constructor() {
    this.removeEmptyObjects = this.removeEmptyObjects.bind(this);
  }
  deserialize(record) {
    return record;
  }

  removeEmptyObjects(obj) {
    if (_.isArray(obj)) {
      let mappedValues = obj.map((value) => this.removeEmptyObjects(value));
      let filterValues = mappedValues.filter((value) => !_.isEmpty(value));
      return filterValues;
    } else if (_.isObject(obj)) {
      let mappedValues = _.mapValues(obj, (value) =>
        this.removeEmptyObjects(value)
      );
      let pickedValues = _.pickBy(mappedValues, (value) => {
        if (_.isArray(value) || _.isObject(value)) {
          return !_.isEmpty(value);
        }
        return !_.isNull(value);
      });
      return pickedValues;
    }
    return obj ? obj : null;
  }

  serialize(record) {
    let stripped_record = this.removeEmptyObjects(record);
    // TODO: Remove when fields are implemented and
    // we use deposit backend API
    let _missingRecordFields = {
      _access: {
        metadata_restricted: false,
        files_restricted: false,
      },
      _owners: [1],
      _created_by: 1,
      // titles: [
      //   {
      //     lang: 'eng',
      //     type: 'MainTitle',
      //     title: stripped_record['titles']
      //       ? stripped_record['titles'][0]['title']
      //       : '',
      //   },
      // ],
      // TODO: Remove this when we fix the `Identifiers` schema
      creators: [],
      contributors: [],
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
      community: {
        primary: 'Maincom',
        secondary: ['Subcom One', 'Subcon Two'],
      },
    };
    return { ...stripped_record, ..._missingRecordFields };
  }
}
