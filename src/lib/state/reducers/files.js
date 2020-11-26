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
  SET_CURRENT_PREVIEW_FILE,
  SET_CURRENT_PREVIEW_FILE_FAILED,
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
        [action.payload.filename]: {
          progress: 0,
          filename: action.payload.filename,
          size: action.payload.size,
          status: UploadState.initial,
          checksum: null,
          links: null,
          cancel: null,
        },
      };
    case FILE_UPLOAD_START:
      return {
        ...state,
        [action.payload.filename]: {
          progress: 0,
          filename: action.payload.filename,
          size: action.payload.size,
          status: UploadState.uploading,
          checksum: null,
          links: null,
          cancel: null,
        },
        isFileUploadInProgress: true,
      };
    case FILE_UPLOAD_IN_PROGRESS:
      return {
        ...state,
        [action.payload.filename]: {
          ...state[action.payload.filename],
          progress: action.payload.percent,
          status: UploadState.uploading,
        },
      };
    case FILE_UPLOAD_FINISHED:
      newState = {
        ...state,
        [action.payload.filename]: {
          ...state[action.payload.filename],
          status: UploadState.finished,
          size: action.payload.size,
          progress: 100,
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
        [action.payload.filename]: {
          ...state[action.payload.filename],
          status: UploadState.error,
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
        [action.payload.filename]: {
          ...state[action.payload.filename],
          cancel: action.payload.cancel,
        },
      };
    case FILE_UPLOAD_CANCELLED:
      const {
        [action.payload.filename]: cancelledFile,
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
        [action.payload.filename]: deletedFile,
        ...afterDeletionState
      } = state;
      return {
        ...afterDeletionState,
      };
    case FILE_DELETE_FAILED:
      // TODO: handle
      return state;
    case SET_CURRENT_PREVIEW_FILE:
      return {
        ...state,
        defaultFilePreview: action.payload,
      };
    case SET_CURRENT_PREVIEW_FILE_FAILED:
      // TODO: handle
      return state;
    default:
      return state;
  }
};
