// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { DepositFileApiClient } from './DepositApiClient';
import {
  RDMDepositFilesService,
  UploadProgressNotifier,
} from './DepositFilesService';

let fakeApiIsCancelled = jest.fn();
let fakeApiInitializeFileUpload = jest.fn();
let fakeApiUploadFile = jest.fn((url, file, progressFn, cancelFn) => {
  cancelFn(() => 'cancelled');
  progressFn(20);
});
let fakeApiFinalizeFileUpload = jest.fn();
let fakeApiDeleteFile = jest.fn();
class FakeFileApiClient extends DepositFileApiClient {
  isCancelled(error) {
    return fakeApiIsCancelled(error);
  }

  initializeFileUpload(initializeUploadUrl, filename) {
    return fakeApiInitializeFileUpload(initializeUploadUrl, filename);
  }

  uploadFile(uploadUrl, file, onUploadProgress, cancel) {
    return fakeApiUploadFile(uploadUrl, file, onUploadProgress, cancel);
  }

  finalizeFileUpload(finalizeUploadUrl) {
    return fakeApiFinalizeFileUpload(finalizeUploadUrl);
  }

  deleteFile(fileLinks) {
    return fakeApiDeleteFile(fileLinks);
  }
}

let fakeOnUploadInitiated = jest.fn();
let fakeOnUploadStarted = jest.fn();
let fakeOnUploadProgress = jest.fn();
let fakeOnUploadCompleted = jest.fn();
let fakeOnUploadCancelled = jest.fn();
let fakeOnUploadFailed = jest.fn();
class FakeProgressNotifier extends UploadProgressNotifier {
  onUploadInitiated(filename) {
    fakeOnUploadInitiated(filename);
  }
  onUploadStarted(filename, cancelFunc) {
    fakeOnUploadStarted(filename, cancelFunc);
  }
  onUploadProgress(filename, percent) {
    fakeOnUploadProgress(filename, percent);
  }
  onUploadCompleted(filename, size, checksum, links) {
    fakeOnUploadCompleted(filename, size, checksum, links);
  }
  onUploadCancelled(filename) {
    fakeOnUploadCancelled(filename);
  }
  onUploadFailed(filename) {
    fakeOnUploadFailed(filename);
  }
}

afterEach(() => {
  jest.resetAllMocks();
});

describe.skip('DepositFilesService tests', () => {
  const fileApiClient = new FakeFileApiClient();
  const progressNotifier = new FakeProgressNotifier();
  const uploader = new RDMDepositFilesService(fileApiClient, 1);
  uploader.setProgressNotifier(progressNotifier);

  const expectedFilename = 'file1';
  const fakeFileData = {
    key: expectedFilename,
    size: '100',
    checksum: 'abcd',
    links: {
      self: 'self URL',
      content: 'start upload URL',
      commit: 'finalize upload URL',
    },
  };
  const fakeDataAfterInit = {
    data: {
      entries: [fakeFileData],
    },
  };

  it('it should add a new file to upload to the queue and start the upload', async () => {
    fakeApiInitializeFileUpload.mockReturnValueOnce(fakeDataAfterInit);
    fakeApiFinalizeFileUpload.mockReturnValueOnce({
      data: fakeFileData,
    });

    await uploader.upload('init upload URL', { name: 'file1' });

    let params, filename;
    expect(fakeOnUploadInitiated).toHaveBeenCalledTimes(1);
    filename = fakeOnUploadInitiated.mock.calls[0][0];
    expect(filename).toEqual(expectedFilename);

    expect(fakeOnUploadStarted).toHaveBeenCalledTimes(1);
    params = fakeOnUploadStarted.mock.calls[0];
    filename = params[0];
    let cancelFn = params[1];
    expect(filename).toEqual(expectedFilename);
    expect(cancelFn()).toEqual('cancelled');

    expect(fakeOnUploadProgress).toHaveBeenCalledTimes(1);
    params = fakeOnUploadProgress.mock.calls[0];
    filename = params[0];
    let percent = params[1];
    expect(filename).toEqual(expectedFilename);
    expect(percent).toBeGreaterThan(0);

    expect(fakeOnUploadCompleted).toHaveBeenCalledTimes(1);
    params = fakeOnUploadCompleted.mock.calls[0];
    expect({
      key: params[0],
      size: params[1],
      checksum: params[2],
      links: params[3],
    }).toEqual(fakeFileData);
  });

  it('it should call the error callback when the init upload fails', async () => {
    fakeApiIsCancelled.mockReturnValueOnce(false);
    fakeApiInitializeFileUpload.mockRejectedValueOnce(
      new Error('init upload error')
    );

    await uploader.upload('init upload URL', { name: 'file1' });

    expect(fakeOnUploadFailed).toHaveBeenCalledTimes(1);
    expect(fakeOnUploadInitiated).not.toHaveBeenCalled();
    expect(fakeOnUploadStarted).not.toHaveBeenCalled();
  });

  it('it should call the error callback when the upload fails and delete file', async () => {
    fakeApiIsCancelled.mockReturnValueOnce(false);
    fakeApiInitializeFileUpload.mockReturnValueOnce(fakeDataAfterInit);
    fakeApiUploadFile.mockRejectedValueOnce(new Error('upload error'));

    await uploader.upload('init upload URL', { name: 'file1' });

    expect(fakeOnUploadInitiated).toHaveBeenCalledTimes(1);
    expect(fakeOnUploadFailed).toHaveBeenCalledTimes(1);
    let filename = fakeOnUploadFailed.mock.calls[0][0];
    expect(filename).toEqual(expectedFilename);
    expect(fakeApiDeleteFile).toHaveBeenCalledTimes(1);
    let fileLinks = fakeApiDeleteFile.mock.calls[0][0];
    expect(fileLinks).toEqual(fakeFileData.links);
    expect(fakeOnUploadStarted).not.toHaveBeenCalled();
    expect(fakeOnUploadProgress).not.toHaveBeenCalled();
    expect(fakeOnUploadCompleted).not.toHaveBeenCalled();
    expect(fakeOnUploadCancelled).not.toHaveBeenCalled();
  });

  it('it should call the error callback when the finalize upload fails and delete file', async () => {
    fakeApiIsCancelled.mockReturnValueOnce(false);
    fakeApiInitializeFileUpload.mockReturnValueOnce(fakeDataAfterInit);
    fakeApiFinalizeFileUpload.mockRejectedValueOnce(
      new Error('finalize upload error')
    );

    await uploader.upload('init upload URL', { name: 'file1' });

    expect(fakeOnUploadInitiated).toHaveBeenCalledTimes(1);
    expect(fakeOnUploadStarted).toHaveBeenCalledTimes(1);
    expect(fakeOnUploadProgress).toHaveBeenCalledTimes(1);
    expect(fakeOnUploadFailed).toHaveBeenCalledTimes(1);
    let filename = fakeOnUploadFailed.mock.calls[0][0];
    expect(filename).toEqual(expectedFilename);
    expect(fakeApiDeleteFile).toHaveBeenCalledTimes(1);
    expect(fakeOnUploadCompleted).not.toHaveBeenCalled();
    expect(fakeOnUploadCancelled).not.toHaveBeenCalled();
  });

  it('it should call the cancel callback when the upload is cancelled and delete file', async () => {
    fakeApiIsCancelled.mockReturnValueOnce(true);
    fakeApiInitializeFileUpload.mockReturnValueOnce(fakeDataAfterInit);
    fakeApiUploadFile.mockRejectedValueOnce(new Error('upload error'));

    await uploader.upload('init upload URL', { name: 'file1' });

    expect(fakeOnUploadInitiated).toHaveBeenCalledTimes(1);
    expect(fakeOnUploadCancelled).toHaveBeenCalledTimes(1);
    let filename = fakeOnUploadCancelled.mock.calls[0][0];
    expect(filename).toEqual(expectedFilename);
    expect(fakeApiDeleteFile).toHaveBeenCalledTimes(1);
    let fileLinks = fakeApiDeleteFile.mock.calls[0][0];
    expect(fileLinks).toEqual(fakeFileData.links);
    expect(fakeOnUploadStarted).not.toHaveBeenCalled();
    expect(fakeOnUploadProgress).not.toHaveBeenCalled();
    expect(fakeOnUploadCompleted).not.toHaveBeenCalled();
    expect(fakeOnUploadFailed).not.toHaveBeenCalled();
  });
});
