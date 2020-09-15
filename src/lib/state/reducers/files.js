// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import {
  FILE_UPLOAD_CANCELLED,
  FILE_UPLOAD_SET_CANCEL_FUNCTION,
  FILE_DELETE_FAILED,
  FILE_DELETED_SUCCESS,
  FILE_UPLOAD_IN_PROGRESS,
  FILE_UPLOAD_START,
  FILE_UPLOAD_FINISHED,
  FILE_UPLOAD_FAILED,
  FILE_UPLOAD_INITIATE,
} from '../types';

export const UploadState = {
  initial: 'initial', // no file or the initial file selected
  uploading: 'uploading', // currently uploading a file
  error: 'error', // upload failed
  finished: 'finished', // upload finished (uploaded file is the field's current file)
};

const initialState = {};

export default (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case FILE_UPLOAD_INITIATE:
      return {
        ...state,
        ...action.payload.reduce((obj, file) => {
          obj[file.fileName] = {
            progress: 0,
            fileName: file.fileName,
            size: file.size,
            state: UploadState.initial,
            checksum: null,
            links: null,
            cancel: null,
          };
          return obj;
        }, {}),
      };
    case FILE_UPLOAD_START:
      return {
        ...state,
        [action.payload.fileName]: {
          progress: 0,
          fileName: action.payload.fileName,
          size: action.payload.size,
          state: UploadState.uploading,
          checksum: null,
          links: null,
          cancel: null,
        },
        isFileUploadInProgress: true,
      };
    case FILE_UPLOAD_IN_PROGRESS:
      return {
        ...state,
        [action.payload.fileName]: {
          ...state[action.payload.fileName],
          progress: action.payload.percent,
          state: UploadState.uploading,
        },
      };
    case FILE_UPLOAD_FINISHED:
      newState = {
        ...state,
        [action.payload.fileName]: {
          ...state[action.payload.fileName],
          state: UploadState.finished,
          checksum: action.payload.checksum,
          links: action.payload.links,
          cancel: null,
        },
      };
      return {
        ...newState,
        isFileUploadInProgress: Object.values(newState).some(
          (value) => value.state === UploadState.uploading
        ),
      };
    case FILE_UPLOAD_FAILED:
      newState = {
        ...state,
        [action.payload.fileName]: {
          ...state[action.payload.fileName],
          state: UploadState.error,
          cancel: null,
        },
      };
      return {
        ...newState,
        isFileUploadInProgress: Object.values(newState).some(
          (value) => value.state === UploadState.uploading
        ),
      };
    case FILE_UPLOAD_SET_CANCEL_FUNCTION:
      return {
        ...state,
        [action.payload.fileName]: {
          ...state[action.payload.fileName],
          cancel: action.payload.cancel,
        },
      };
    case FILE_UPLOAD_CANCELLED:
      const {
        [action.payload.fileName]: cancelledFile,
        ...afterCancellationState
      } = state;
      return {
        ...afterCancellationState,
        isFileUploadInProgress: Object.values(afterCancellationState).some(
          (value) => value.state === UploadState.uploading
        ),
      };
    case FILE_DELETED_SUCCESS:
      const {
        [action.payload.fileName]: deletedFile,
        ...afterDeletionState
      } = state;
      return {
        ...afterDeletionState,
      };
    case FILE_DELETE_FAILED:
      // TODO: handle
      return state;
    default:
      return state;
  }
};
