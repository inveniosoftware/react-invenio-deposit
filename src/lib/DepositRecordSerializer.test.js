// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { DepositRecordSerializer } from './DepositRecordSerializer';

describe('Record serializer', () => {
  describe('removeEmptyValues', () => {
    const serializer = new DepositRecordSerializer();
    const record = {
      contributors: [{ identifiers: [] }],
      version: 0,
      cool: false,
      creators: [null, undefined, {}],
      description: '',
    };

    const cleanedRecord = serializer.removeEmptyValues(record);

    expect(cleanedRecord).toEqual({ version: 0 });
  });

  describe('creators', () => {
    it('transforms identifiers arrays into objects', () => {
      const serializer = new DepositRecordSerializer();
      const record = {
        metadata: {
          creators: [
            {
              identifiers: [
                { scheme: 'Orcid', identifier: '0000-0002-1825-0097' },
                { scheme: 'foo', identifier: 'bar' },
              ],
            },
            {
              identifiers: [
                { scheme: 'ror', identifier: '03yrm5c26' },
                { scheme: 'baz', identifier: 'zed' },
              ],
            },
          ],
        },
      };

      const serialized_record = serializer.serializeCreators(record);
      expect(serialized_record.metadata.creators[0].identifiers).toEqual({
        Orcid: '0000-0002-1825-0097',
        foo: 'bar',
      });
      expect(serialized_record.metadata.creators[1].identifiers).toEqual({
        ror: '03yrm5c26',
        baz: 'zed',
      });
    });

    it('picks last scheme if duplicates', () => {
      const serializer = new DepositRecordSerializer();
      const record = {
        metadata: {
          creators: [
            {
              identifiers: [
                { scheme: 'Orcid', identifier: '0000-0002-1825-0097' },
                { scheme: 'Orcid', identifier: '0000-0002-1825-0098' },
              ],
            },
          ],
        },
      };

      const serialized_record = serializer.serializeCreators(record);

      expect(serialized_record.metadata.creators[0].identifiers).toEqual({
        Orcid: '0000-0002-1825-0098',
      });
    });
  });

  describe('contributors', () => {
    it('transforms identifiers arrays into objects', () => {
      const serializer = new DepositRecordSerializer();
      const record = {
        metadata: {
          contributors: [
            {
              identifiers: [
                { scheme: 'Orcid', identifier: '0000-0002-1825-0097' },
                { scheme: 'foo', identifier: 'bar' },
              ],
            },
            {
              identifiers: [
                { scheme: 'ror', identifier: '03yrm5c26' },
                { scheme: 'baz', identifier: 'zed' },
              ],
            },
          ],
        },
      };

      const serialized_record = serializer.serializeContributors(record);

      expect(serialized_record.metadata.contributors[0].identifiers).toEqual({
        Orcid: '0000-0002-1825-0097',
        foo: 'bar',
      });
      expect(serialized_record.metadata.contributors[1].identifiers).toEqual({
        ror: '03yrm5c26',
        baz: 'zed',
      });
    });

    it('picks last scheme if duplicates', () => {
      const serializer = new DepositRecordSerializer();
      const record = {
        metadata: {
          contributors: [
            {
              identifiers: [
                { scheme: 'Orcid', identifier: '0000-0002-1825-0097' },
                { scheme: 'Orcid', identifier: '0000-0002-1825-0098' },
              ],
            },
          ],
        },
      };

      const serialized_record = serializer.serializeContributors(record);

      expect(serialized_record.metadata.contributors[0].identifiers).toEqual({
        Orcid: '0000-0002-1825-0098',
      });
    });

    it('acts correctly when no input', () => {
      // Note that since removeEmptyValues cleans up empty inputs, we have
      // fewer cases to test.
      const serializer = new DepositRecordSerializer();

      // if contributors empty, leave empty
      let record = {};

      let serialized_record = serializer.serializeContributors(record);

      expect(serialized_record).toEqual(record);

      // if contributors only have type defined, empty it out
      record = {
        metadata: {
          contributors: [
            {
              type: 'Personal',
            },
            {
              type: 'Organizational',
            },
          ],
        },
      };

      serialized_record = serializer.serializeContributors(record);

      expect(serialized_record).toEqual({ metadata: {} });

      // if identifiers is absent, leave absent
      record = {
        contributors: [{ name: 'Alice' }],
      };

      serialized_record = serializer.serializeContributors(record);

      expect(serialized_record).toEqual(record);
    });
  });

  describe('deserialize', () => {
    const serializer = new DepositRecordSerializer();
    const record = {
      foo: 'bar',
    };

    const deserializedRecord = serializer.deserialize(record);

    expect(deserializedRecord).toEqual(record);
  });
});
