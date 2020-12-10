// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import {
  ACTION_CREATE_SUCCEEDED,
  ACTION_PUBLISH_SUCCEEDED,
  ACTION_PUBLISH_FAILED,
  ACTION_SAVE_PARTIALLY_SUCCEEDED,
  ACTION_SAVE_SUCCEEDED,
  ACTION_SAVE_FAILED,
  FORM_ACTION_EVENT_EMITTED,
  FORM_PUBLISH_SUCCEEDED,
  FORM_PUBLISH_FAILED,
  FORM_SAVE_SUCCEEDED,
  FORM_SAVE_PARTIALLY_SUCCEEDED,
  FORM_SAVE_FAILED,
} from '../types';

export default (state = {}, action) => {
  switch (action.type) {
    case ACTION_CREATE_SUCCEEDED:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        formAction: null,
      };
    case FORM_ACTION_EVENT_EMITTED:
      return {
        ...state,
        formAction: action.payload,
      };
    case ACTION_SAVE_SUCCEEDED:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        errors: {},
        formAction: FORM_SAVE_SUCCEEDED,
      };
    case ACTION_SAVE_PARTIALLY_SUCCEEDED:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        errors: { ...action.payload.errors },
        formAction: FORM_SAVE_PARTIALLY_SUCCEEDED,
      };
    case ACTION_SAVE_FAILED:
      return {
        ...state,
        errors: { ...action.payload.errors },
        formAction: FORM_SAVE_FAILED,
      };
    case ACTION_PUBLISH_SUCCEEDED:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        formAction: FORM_PUBLISH_SUCCEEDED,
      };
    case ACTION_PUBLISH_FAILED:
      return {
        ...state,
        errors: { ...action.payload.errors },
        formAction: FORM_PUBLISH_FAILED,
      };

    default:
      return state;
  }
};
