// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { DepositRecordSerializer } from './DepositRecordSerializer';
import {
  emptyDate,
  emptyFunding,
  emptyIdentifier,
  emptyRelatedWork,
} from './record';

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
    describe('dates', () => {
      it('serializes array as-is if filled', () => {
        const record = {
          metadata: {
            dates: [
              {
                date: '2020/08',
                type: 'accepted',
                description: 'bar',
              },
            ],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata.dates).toEqual([
          {
            date: '2020/08',
            type: 'accepted',
            description: 'bar',
          },
        ]);
      });

      it("doesn't serialize if only default is present", () => {
        const record = {
          metadata: {
            dates: [emptyDate],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord).toEqual({ metadata: {} });
      });
    });

    describe('alternate identifiers', () => {
      it('serializes array as-is if filled', () => {
        const record = {
          metadata: {
            identifiers: [
              { scheme: 'doi', identifier: '10.5281/zenodo.9999999' },
            ],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata.identifiers).toEqual([
          {
            scheme: 'doi',
            identifier: '10.5281/zenodo.9999999',
          },
        ]);
      });

      it("doesn't serialize if only default is present", () => {
        const record = {
          metadata: {
            identifiers: [emptyIdentifier],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord).toEqual({ metadata: {} });
      });
    });

    describe('related identifiers', () => {
      it('serializes array as-is if filled', () => {
        const record = {
          metadata: {
            related_identifiers: [
              {
                scheme: 'doi',
                identifier: '10.5281/zenodo.9999988',
                resource_type: 'image-photo',
                relation_type: 'requires',
              },
            ],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord.metadata.related_identifiers).toEqual([
          {
            scheme: 'doi',
            identifier: '10.5281/zenodo.9999988',
            resource_type: { id: 'image-photo' },
            relation_type: 'requires',
          },
        ]);
      });

      it("doesn't serialize if only default is present", () => {
        const record = {
          metadata: {
            related_identifiers: [emptyRelatedWork],
          },
        };

        const serializedRecord = serializer.serialize(record);

        expect(serializedRecord).toEqual({ metadata: {} });
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
          creators: [],
          contributors: [],
          resource_type: '',
          publication_date: '',
          dates: [emptyDate],
          languages: [],
          identifiers: [emptyIdentifier],
          related_identifiers: [emptyRelatedWork],
          subjects: [],
          funding: [emptyFunding],
          version: '',
        },
        access: {
          record: 'public',
          files: 'public',
        },
        pids: {},
      };

      const deserializedRecord = serializer.deserialize(record);

      expect(deserializedRecord).toEqual(expectedRecord);
    });

    it('deserialize a full record', () => {
      const record = {
        access: {
          access_right: 'open',
          files: false,
          metadata: false,
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
        pids: {
          doi: {
            identifier: '10.1234/rec.nz13t-me993',
            provider: 'datacite',
            client: 'rdm',
          },
        },
        metadata: {
          contributors: [
            {
              person_or_org: {
                name: 'Jane Smith',
                type: 'personal',
                identifiers: [
                  {
                    identifier: '0000-0002-1825-0097',
                    scheme: 'orcid',
                  },
                ],
              },
              role: { id: 'datacurator' },
            },
          ],
          creators: [
            {
              person_or_org: { name: 'John Doe', type: 'personal' },
              affiliations: [
                {
                  name: 'CERN',
                  identifiers: [
                    {
                      identifier: '01ggx4157',
                      scheme: 'ror',
                    },
                  ],
                },
              ],
            },
          ],
          publication_date: '2020-09-28',
          resource_type: { id: 'lesson' },
          title: 'Test 2020-1028 13:34',
          additional_titles: [
            {
              title: 'Another title',
              type: { title: 'Abstract', id: 'abstract' },
              lang: { title: 'Danish', id: 'dan' },
            },
          ],
          dates: [{ date: '1920/2020', type: 'collected', description: 'foo' }],
          languages: [
            { title: 'en', id: 'en_id' },
            { title: 'fr', id: 'fr_id' },
          ],
          identifiers: [
            { scheme: 'doi', identifier: '10.5281/zenodo.9999999' },
          ],
          related_identifiers: [
            {
              scheme: 'doi',
              identifier: '10.5281/zenodo.9999988',
              resource_type: { id: 'image-photo' },
              relation_type: 'requires',
            },
          ],
          subjects: [
            {
              title: 'MeSH: Cognitive Neuroscience',
              id: 'mesh_1',
            },
          ],
          funding: [
            {
              funder: {
                name: 'Funder 2',
                identifier: 'funder2',
                scheme: 'funderScheme2',
              },
              award: {
                title: 'Award B2',
                number: 'B21234',
                identifier: 'awardB2',
                scheme: 'awardSchemeB',
              },
            },
          ],
          version: 'v2.0.0',
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
        },
        id: 'wk205-00878',
        links: {
          publish:
            'https://127.0.0.1:5000/api/records/wk205-00878/draft/actions/publish',
          self: 'https://127.0.0.1:5000/api/records/wk205-00878/draft',
          self_html: 'https://127.0.0.1:5000/uploads/wk205-00878',
        },
        pids: {
          doi: {
            identifier: '10.1234/rec.nz13t-me993',
            provider: 'datacite',
            client: 'rdm',
          },
        },
        metadata: {
          contributors: [
            {
              person_or_org: {
                name: 'Jane Smith',
                type: 'personal',
                identifiers: [
                  {
                    identifier: '0000-0002-1825-0097',
                    scheme: 'orcid',
                  },
                ],
              },
              role: 'datacurator',
            },
          ],
          creators: [
            {
              affiliations: [
                {
                  name: 'CERN',
                  identifiers: [
                    {
                      scheme: 'ror',
                      identifier: '01ggx4157',
                    },
                  ],
                },
              ],
              person_or_org: {
                name: 'John Doe',
                type: 'personal',
              },
            },
          ],
          publication_date: '2020-09-28',
          resource_type: 'lesson',
          title: 'Test 2020-1028 13:34',
          additional_titles: [
            { title: 'Another title', type: 'abstract', lang: 'dan' },
          ],
          dates: [{ date: '1920/2020', type: 'collected', description: 'foo' }],
          languages: ['en_id', 'fr_id'],
          identifiers: [
            { scheme: 'doi', identifier: '10.5281/zenodo.9999999' },
          ],
          related_identifiers: [
            {
              scheme: 'doi',
              identifier: '10.5281/zenodo.9999988',
              resource_type: 'image-photo',
              relation_type: 'requires',
            },
          ],
          subjects: ['mesh_1'],
          funding: [
            {
              funder: {
                name: 'Funder 2',
                identifier: 'funder2',
                scheme: 'funderScheme2',
              },
              award: {
                title: 'Award B2',
                number: 'B21234',
                identifier: 'awardB2',
                scheme: 'awardSchemeB',
              },
            },
          ],
          version: 'v2.0.0',
        },
      };
      expect(deserializedRecord).toEqual(expectedRecord);
    });
  });
});
