// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import {
  FILE_DELETED_SUCCESS,
  FILE_DELETE_FAILED,
  FILE_UPLOAD_CANCELLED,
  FILE_UPLOAD_FAILED,
  FILE_UPLOAD_FINISHED,
  FILE_UPLOAD_INITIATE,
  FILE_UPLOAD_IN_PROGRESS,
  FILE_UPLOAD_SET_CANCEL_FUNCTION,
  FILE_UPLOAD_START,
  SET_DEFAULT_PREVIEW_FILE,
  SET_DEFAULT_PREVIEW_FILE_FAILED,
  TOGGLE_FILES_ENABLED,
} from '../types';

export const UploadState = {
  initial: 'initial', // no file or the initial file selected
  uploading: 'uploading', // currently uploading a file from the UI
  error: 'error', // upload failed
  finished: 'finished', // upload finished (uploaded file is the field's current file)
  pending: 'pending', // files retrieved from the backend are in pending state
};

const initialState = {};

export default (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case FILE_UPLOAD_INITIATE:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.filename]: {
            progress: 0,
            name: action.payload.filename,
            size: action.payload.size,
            status: UploadState.initial,
            checksum: null,
            links: null,
            cancel: null,
          },
        },
      };
    case FILE_UPLOAD_START:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.filename]: {
            progress: 0,
            name: action.payload.filename,
            size: action.payload.size,
            status: UploadState.uploading,
            checksum: null,
            links: null,
            cancel: null,
          },
        },
        isFileUploadInProgress: true,
      };
    case FILE_UPLOAD_IN_PROGRESS:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.filename]: {
            ...state.entries[action.payload.filename],
            progress: action.payload.percent,
            status: UploadState.uploading,
          },
        },
      };
    case FILE_UPLOAD_FINISHED:
      newState = {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.filename]: {
            ...state.entries[action.payload.filename],
            status: UploadState.finished,
            size: action.payload.size,
            progress: 100,
            checksum: action.payload.checksum,
            links: action.payload.links,
            cancel: null,
          },
        },
      };
      return {
        ...newState,
        isFileUploadInProgress: Object.values(newState.entries).some(
          (value) => value.status === UploadState.uploading
        ),
      };
    case FILE_UPLOAD_FAILED:
      newState = {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.filename]: {
            ...state.entries[action.payload.filename],
            status: UploadState.error,
            cancel: null,
          },
        },
      };
      return {
        ...newState,
        isFileUploadInProgress: Object.values(newState.entries).some(
          (value) => value.status === UploadState.uploading
        ),
      };
    case FILE_UPLOAD_SET_CANCEL_FUNCTION:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.filename]: {
            ...state.entries[action.payload.filename],
            cancel: action.payload.cancel,
          },
        },
      };
    case FILE_UPLOAD_CANCELLED:
      const {
        [action.payload.filename]: cancelledFile,
        ...afterCancellationEntriesState
      } = state.entries;
      return {
        ...state,
        entries: {
          ...afterCancellationEntriesState,
        },
        isFileUploadInProgress: Object.values(
          afterCancellationEntriesState
        ).some((value) => value.status === UploadState.uploading),
      };
    case FILE_DELETED_SUCCESS:
      const {
        [action.payload.filename]: deletedFile,
        ...afterDeletionEntriesState
      } = state.entries;
      return {
        ...state,
        entries: { ...afterDeletionEntriesState },
        isFileUploadInProgress: Object.values(afterDeletionEntriesState).some(
          (value) => value.status === UploadState.uploading
        ),
      };
    case FILE_DELETE_FAILED:
      // TODO: handle
      return state;
    case SET_DEFAULT_PREVIEW_FILE:
      return {
        ...state,
        defaultFilePreview: action.payload.filename,
      };
    case SET_DEFAULT_PREVIEW_FILE_FAILED:
      // TODO: handle
      return state;
    case TOGGLE_FILES_ENABLED:
      return {
        ...state,
        enabled: action.payload.filesEnabled,
      };
    default:
      return state;
  }
};
