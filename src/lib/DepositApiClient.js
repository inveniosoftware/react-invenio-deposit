// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import axios from 'axios';
import { reject } from 'lodash';

const CancelToken = axios.CancelToken;

export class DepositApiClient {
  constructor(createUrl) {
    this.createUrl = createUrl;
  }

  create(record) {
    // Calls the API to create a new draft
    return axios.post(this.createUrl, record, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  save(record) {
    // Calls the API to save a pre-existing record.
    // If the record does not exist, an error is returned.
    // TODO: Integrate with backend API
    return axios.put(record.links.self, record, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Publishes the record by calling its publish link.
   *
   * @param {object} record - the payload from create()
   */
  publish(record) {
    // For now publish returns an error when titles array is empty
    // This has the shape of what our current API returns when there are errors
    // in the API call
    return axios.post(
      record.links.publish,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  initializeFileUpload(initializeUploadUrl, file) {
    const payload = [
      {
        key: file.name,
        size: file.size,
      },
    ];
    // TODO: restore when REST file integration is complete
    // return axios.post(initializeUploadUrl, payload, {
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    // });

    // TODO: remobe when REST file integration is complete
    return new Promise((resolve, reject) => {
      resolve({
        data: {
          entries: [
            {
              id: '1234',
              created: '2020-11-15T19:04:22',
              updated: '2020-11-15T19:04:22',
              key: file.name,

              checksum: 'md5:abcdef...',
              size: file.size,
              metadata: {
                description: 'Published article PDF.',
              },
              links: {
                upload: {
                  href: `${initializeUploadUrl}/${file.name}/upload`,
                  method: 'PUT',
                },
                self: `${initializeUploadUrl}/${file.name}`,
              },
            },
          ],
        },
      });
    });
  }

  uploadFile(uploadUrl, file, onUploadProgress, cancel) {
    const formData = new FormData();
    formData.append('file', file);

    // TODO: restore when REST file integration is complete
    // return axios.put(uploadUrl, file, {
    //   headers: {
    //     'content-type': 'application/octet-stream',
    //   },
    //   onUploadProgress,
    //   cancelToken: new CancelToken(cancel),
    // });

    // TODO: remove when REST file integration is complete
    return new Promise((resolve, reject) => {
      resolve({
        data: {
          mimetype: 'application/zip',
          checksum: 'md5:2942bfabb3d05332b66eb128e0842cff',
          size: file.size,
        },
      });
    });
  }

  finalizeFileUpload(finalizeUploadUrl, file) {
    // TODO: restore when REST file integration is complete
    // return axios.post(finalizeUploadUrl, {} , {
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    // });

    // TODO: remove when REST file integration is complete
    return new Promise((resolve, reject) => {
      resolve({
        data: {
          id: '...',
          created: '2020-11-15T19:04:22',
          updated: '2020-11-15T19:04:22',
          key: file.name,

          checksum: 'md5:abcdef...',
          size: file.size,
          metadata: {
            description: 'Published article PDF.',
          },
          links: {
            self: '/api/records/12345-aaaaa/draft/files/article.pdf',
          },
        },
      });
    });
  }

  deleteFile(deleteUrl) {
    // TODO: restore when REST file integration is complete
    // return axios.delete(deleteUrl);

    // TODO: remove when REST file integration is complete
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
