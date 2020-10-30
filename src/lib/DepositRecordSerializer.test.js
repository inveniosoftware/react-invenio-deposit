// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { DepositRecordSerializer } from './DepositRecordSerializer';
import { emptyCreator, emptyContributor, emptyDate } from './record';

describe('DepositRecordSerializer', () => {
  const serializer = new DepositRecordSerializer();

  describe('removeEmptyValues', () => {
    const record = {
      contributors: [{ identifiers: [] }],
      version: 0,
      cool: false,
      creators: [null, undefined, {}],
      description: '',
    };

    const cleanedRecord = serializer.removeEmptyValues(record);

    expect(cleanedRecord).toEqual({ cool: false, version: 0 });
  });

  describe('serialize', () => {
    describe('creators', () => {
      it('transforms identifiers arrays into objects', () => {
        const record = {
          metadata: {
            creators: [
              {
                identifiers: [
                  { scheme: 'orcid', identifier: '0000-0002-1825-0097' },
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

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata.creators[0].identifiers).toEqual({
          orcid: '0000-0002-1825-0097',
          foo: 'bar',
        });
        expect(serializedRecord.metadata.creators[1].identifiers).toEqual({
          ror: '03yrm5c26',
          baz: 'zed',
        });
      });

      it('picks last scheme if duplicates', () => {
        const record = {
          metadata: {
            creators: [
              {
                identifiers: [
                  { scheme: 'orcid', identifier: '0000-0002-1825-0097' },
                  { scheme: 'orcid', identifier: '0000-0002-1825-0098' },
                ],
              },
            ],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata.creators[0].identifiers).toEqual({
          orcid: '0000-0002-1825-0098',
        });
      });
    });

    describe('contributors', () => {
      it('transforms identifiers array into object', () => {
        const record = {
          metadata: {
            contributors: [
              {
                identifiers: [
                  { scheme: 'orcid', identifier: '0000-0002-1825-0097' },
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

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata.contributors[0].identifiers).toEqual({
          orcid: '0000-0002-1825-0097',
          foo: 'bar',
        });
        expect(serializedRecord.metadata.contributors[1].identifiers).toEqual({
          ror: '03yrm5c26',
          baz: 'zed',
        });
      });

      it('picks last scheme if duplicates', () => {
        const record = {
          metadata: {
            contributors: [
              {
                identifiers: [
                  { scheme: 'orcid', identifier: '0000-0002-1825-0097' },
                  { scheme: 'orcid', identifier: '0000-0002-1825-0098' },
                ],
              },
            ],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata.contributors[0].identifiers).toEqual({
          orcid: '0000-0002-1825-0098',
        });
      });

      it('acts correctly when no input', () => {
        // Note that since removeEmptyValues cleans up empty inputs, we have
        // fewer cases to test.

        // if contributors empty, leave empty
        let record = {};

        let serializedRecord = serializer.serialize(record);

        expect(serializedRecord).toEqual({});

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

        serializedRecord = serializer.serialize(record);

        expect(serializedRecord).toEqual({ metadata: {} });

        // if identifiers is absent, leave absent
        record = {
          metadata: { contributors: [{ name: 'Alice' }] },
        };

        serializedRecord = serializer.serialize(record);

        let expectedRecord = {
          metadata: {
            contributors: [{ name: 'Alice' }],
          },
        };
        expect(serializedRecord).toEqual(expectedRecord);
      });
    });

    describe('dates', () => {
      it('serializes array as-is if filled', () => {
        const record = {
          metadata: {
            dates: [
              {
                date: "2020/08",
                type: "accepted",
                description: "bar"
              },
            ],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata.dates).toEqual([{
          date: "2020/08",
          type: "accepted",
          description: "bar"
        }]);
      });

      it("doesn't serialize if only default is present", () => {
        const record = {
          metadata: {
            dates: [emptyDate],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata).toEqual({});
      });
    });

  });

  describe('deserialize', () => {
    it('fills empty values with predefined values', () => {
      const record = {
        access: {},
        metadata: {
          title: null,
        },
      };
      const expectedRecord = {
        metadata: {
          title: '',
          additional_titles: [],
          creators: [emptyCreator],
          contributors: [emptyContributor],
          resource_type: '',
          publication_date: '',
          dates: [emptyDate],
        },
        access: {
          metadata: false,
          files: false,
          owned_by: [1],
          access_right: 'open',
        },
      };

      const deserializedRecord = serializer.deserialize(record);

      expect(deserializedRecord).toEqual(expectedRecord);
    });

    it('deserializes a full record', () => {
      const record = {
        access: {
          access_right: 'open',
          files: false,
          metadata: false,
          owned_by: [1],
        },
        conceptid: 'nz13t-me993',
        created: '2020-10-28 18:35:58.113520',
        expires_at: '2020-10-28 18:35:58.113692',
        id: 'wk205-00878',
        links: {
          publish:
            'https://127.0.0.1:5000/api/records/wk205-00878/draft/actions/publish',
          self: 'https://127.0.0.1:5000/api/records/wk205-00878/draft',
          self_html: 'https://127.0.0.1:5000/uploads/wk205-00878',
        },
        metadata: {
          contributors: [
            {
              name: 'Jane Smith',
              role: 'datacurator',
              type: 'personal',
              identifiers: {
                orcid: '0000-0002-1825-0097',
              },
            },
          ],
          creators: [{ name: 'John Doe', type: 'personal' }],
          publication_date: '2020-09-28',
          resource_type: { type: 'lesson' },
          title: 'Test 2020-1028 13:34',
          additional_titles: [{title: 'Another title', type: "abstract", lang: "dan"}],
          dates: [{ date: "1920/2020", type: "collected", description: "foo"}],
        },
        revision_id: 1,
        ui: {
          publication_date_l10n: 'Sep 28, 2020',
        },
        updated: '2020-10-28 18:35:58.125222',
      };

      const deserializedRecord = serializer.deserialize(record);

      const expectedRecord = {
        access: {
          access_right: 'open',
          files: false,
          metadata: false,
          owned_by: [1],
        },
        id: 'wk205-00878',
        links: {
          publish:
            'https://127.0.0.1:5000/api/records/wk205-00878/draft/actions/publish',
          self: 'https://127.0.0.1:5000/api/records/wk205-00878/draft',
          self_html: 'https://127.0.0.1:5000/uploads/wk205-00878',
        },
        metadata: {
          contributors: [
            {
              name: 'Jane Smith',
              role: 'datacurator',
              type: 'personal',
              identifiers: [
                {
                  identifier: '0000-0002-1825-0097',
                  scheme: 'orcid',
                },
              ],
            },
          ],
          creators: [{ name: 'John Doe', type: 'personal' }],
          publication_date: '2020-09-28',
          resource_type: { type: 'lesson' },
          title: 'Test 2020-1028 13:34',
          additional_titles: [{title: 'Another title', type: "abstract", lang: "dan"}],
          dates: [{ date: "1920/2020", type: "collected", description: "foo"}],
        },
      };
      expect(deserializedRecord).toEqual(expectedRecord);
    });

  });
});
