// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { DepositRecordSerializer } from "./DepositRecordSerializer";


describe('Record serializer', () => {
  describe('creators', () => {
    it('transforms identifiers arrays into objects', () => {
      const serializer = new DepositRecordSerializer();
      const record = {
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
      };

      const serialized_record = serializer.serializeCreators(record);

      expect(serialized_record.creators[0].identifiers).toEqual(
        { Orcid: '0000-0002-1825-0097', foo: 'bar' },
      );
      expect(serialized_record.creators[1].identifiers).toEqual(
        { ror: '03yrm5c26', baz: 'zed' },
      );
    });

    it('picks last scheme if duplicates', () => {
      const serializer = new DepositRecordSerializer();
      const record = {
        creators: [
          {
            identifiers: [
              { scheme: 'Orcid', identifier: '0000-0002-1825-0097' },
              { scheme: 'Orcid', identifier: '0000-0002-1825-0098' },
            ],
          },
        ],
      };

      const serialized_record = serializer.serializeCreators(record);

      expect(serialized_record.creators[0].identifiers).toEqual({
        Orcid: '0000-0002-1825-0098',
      });
    });
  });

  describe('contributors', () => {
    it('transforms identifiers arrays into objects', () => {
      const serializer = new DepositRecordSerializer();
      const record = {
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
      };

      const serialized_record = serializer.serializeContributors(record);

      expect(serialized_record.contributors[0].identifiers).toEqual({
        Orcid: '0000-0002-1825-0097',
        foo: 'bar',
      });
      expect(serialized_record.contributors[1].identifiers).toEqual({
        ror: '03yrm5c26',
        baz: 'zed',
      });
    });

    it('picks last scheme if duplicates', () => {
      const serializer = new DepositRecordSerializer();
      const record = {
        contributors: [
          {
            identifiers: [
              { scheme: 'Orcid', identifier: '0000-0002-1825-0097' },
              { scheme: 'Orcid', identifier: '0000-0002-1825-0098' },
            ],
          },
        ],
      };

      const serialized_record = serializer.serializeContributors(record);

      expect(serialized_record.contributors[0].identifiers).toEqual({
        Orcid: '0000-0002-1825-0098',
      });
    });
  });
})
