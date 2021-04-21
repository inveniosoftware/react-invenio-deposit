// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import {
  ACTION_CREATE_SUCCEEDED,
  ACTION_DELETE_FAILED,
  ACTION_PUBLISH_FAILED,
  ACTION_PUBLISH_SUCCEEDED,
  ACTION_SAVE_FAILED,
  ACTION_SAVE_PARTIALLY_SUCCEEDED,
  ACTION_SAVE_SUCCEEDED,
  DISCARD_PID_FAILED,
  DISCARD_PID_STARTED,
  DISCARD_PID_SUCCESS,
  FORM_ACTION_EVENT_EMITTED,
  FORM_DELETE_FAILED,
  FORM_PUBLISH_FAILED,
  FORM_PUBLISH_SUCCEEDED,
  FORM_SAVE_FAILED,
  FORM_SAVE_PARTIALLY_SUCCEEDED,
  FORM_SAVE_SUCCEEDED,
  RESERVE_PID_FAILED,
  RESERVE_PID_STARTED,
  RESERVE_PID_SUCCESS,
} from '../types';

export default (state = {}, action) => {
  switch (action.type) {
    case ACTION_CREATE_SUCCEEDED:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        formState: null,
      };
    case ACTION_DELETE_FAILED:
      return {
        ...state,
        formState: FORM_DELETE_FAILED,
      };
    case FORM_ACTION_EVENT_EMITTED:
      return {
        ...state,
        formState: action.payload,
      };
    case ACTION_SAVE_SUCCEEDED:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        errors: {},
        formState: FORM_SAVE_SUCCEEDED,
      };
    case ACTION_SAVE_PARTIALLY_SUCCEEDED:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        errors: { ...action.payload.errors },
        formState: FORM_SAVE_PARTIALLY_SUCCEEDED,
      };
    case ACTION_SAVE_FAILED:
      return {
        ...state,
        errors: { ...action.payload.errors },
        formState: FORM_SAVE_FAILED,
      };
    case ACTION_PUBLISH_SUCCEEDED:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        formState: FORM_PUBLISH_SUCCEEDED,
      };
    case ACTION_PUBLISH_FAILED:
      return {
        ...state,
        errors: { ...action.payload.errors },
        formState: FORM_PUBLISH_FAILED,
      };
    case RESERVE_PID_STARTED:
    case DISCARD_PID_STARTED:
      return {
        ...state,
        reservePIDsLoading: true,
      };
    case RESERVE_PID_SUCCESS:
    case DISCARD_PID_SUCCESS:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        errors: {},
        reservePIDsLoading: false,
      };
    case RESERVE_PID_FAILED:
    case DISCARD_PID_FAILED:
      return {
        ...state,
        errors: { ...action.payload.errors },
        reservePIDsLoading: false,
      };
    default:
      return state;
  }
};
