// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { UploadProgressNotifier } from '../../DepositFilesService';
import {
  FILE_DELETED_SUCCESS,
  FILE_DELETE_FAILED,
  FILE_IMPORT_FAILED,
  FILE_IMPORT_STARTED,
  FILE_IMPORT_SUCCESS,
  FILE_UPLOAD_ADDED,
  FILE_UPLOAD_CANCELLED,
  FILE_UPLOAD_FAILED,
  FILE_UPLOAD_FINISHED,
  FILE_UPLOAD_IN_PROGRESS,
  FILE_UPLOAD_SAVE_DRAFT_FAILED,
  FILE_UPLOAD_SET_CANCEL_FUNCTION,
} from '../types';
import { saveDraftWithUrlUpdate } from './deposit';

class RDMProgressNotifier extends UploadProgressNotifier {
  onUploadAdded(filename) {
    this.dispatcher &&
      this.dispatcher({
        type: FILE_UPLOAD_ADDED,
        payload: {
          filename: filename,
        },
      });
  }

  onUploadStarted(filename, cancelFn) {
    this.dispatcher &&
      this.dispatcher({
        type: FILE_UPLOAD_SET_CANCEL_FUNCTION,
        payload: { filename: filename, cancelUploadFn: cancelFn },
      });
  }

  onUploadProgress(filename, percent) {
    this.dispatcher &&
      this.dispatcher({
        type: FILE_UPLOAD_IN_PROGRESS,
        payload: {
          filename: filename,
          percent: percent,
        },
      });
  }

  onUploadCompleted(filename, size, checksum, links) {
    this.dispatcher &&
      this.dispatcher({
        type: FILE_UPLOAD_FINISHED,
        payload: {
          filename: filename,
          size: size,
          checksum: checksum,
          links: links,
        },
      });
  }

  onUploadCancelled(filename) {
    this.dispatcher &&
      this.dispatcher({
        type: FILE_UPLOAD_CANCELLED,
        payload: {
          filename: filename,
        },
      });
  }

  onUploadFailed(filename) {
    this.dispatcher &&
      this.dispatcher({
        type: FILE_UPLOAD_FAILED,
        payload: {
          filename: filename,
        },
      });
  }
}

const notifier = new RDMProgressNotifier();

export const uploadFiles = (draft, files) => {
  return async (dispatch, _, config) => {
    let response;
    try {
      response = await saveDraftWithUrlUpdate(draft, config.service.drafts);
    } catch (error) {
      dispatch({
        type: FILE_UPLOAD_SAVE_DRAFT_FAILED,
        payload: { errors: error.errors },
      });
      throw error;
    }

    notifier.setDispatcher(dispatch);

    const uploadFileUrl = response.data.links.files;
    for (const file of files) {
      config.service.files.upload(uploadFileUrl, file, notifier);
    }
  };
};

export const deleteFile = (file) => {
  return async (dispatch, _, config) => {
    try {
      const fileLinks = file.links;
      await config.service.files.delete(fileLinks);

      dispatch({
        type: FILE_DELETED_SUCCESS,
        payload: {
          filename: file.name,
        },
      });
    } catch (error) {
      dispatch({ type: FILE_DELETE_FAILED });
      throw error;
    }
  };
};

export const importParentFiles = () => {
  return async (dispatch, getState, config) => {
    const draft = getState().deposit.record;
    if (!draft.id) return;

    dispatch({ type: FILE_IMPORT_STARTED });

    try {
      const draftLinks = draft.links;
      const files = await config.service.files.importParentRecordFiles(
        draftLinks
      );
      dispatch({
        type: FILE_IMPORT_SUCCESS,
        payload: { files: files },
      });
    } catch (error) {
      dispatch({ type: FILE_IMPORT_FAILED });
      throw error;
    }
  };
};
