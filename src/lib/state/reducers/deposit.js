// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import {
  DISCARD_PID_FAILED,
  DISCARD_PID_STARTED,
  DISCARD_PID_SUCCEEDED,
  DRAFT_DELETE_FAILED,
  DRAFT_DELETE_STARTED,
  DRAFT_PREVIEW_FAILED,
  DRAFT_PREVIEW_PARTIALLY_SUCCEEDED,
  DRAFT_PREVIEW_STARTED,
  DRAFT_PUBLISH_FAILED,
  DRAFT_PUBLISH_PARTIALLY_SUCCEEDED,
  DRAFT_PUBLISH_STARTED,
  DRAFT_SAVE_FAILED,
  DRAFT_SAVE_PARTIALLY_SUCCEEDED,
  DRAFT_SAVE_STARTED,
  DRAFT_SAVE_SUCCEEDED,
  RESERVE_PID_FAILED,
  RESERVE_PID_STARTED,
  RESERVE_PID_SUCCEEDED,
} from '../types';

const depositReducer = (state = {}, action) => {
  switch (action.type) {
    case DRAFT_SAVE_STARTED:
    case DRAFT_PUBLISH_STARTED:
    case DRAFT_DELETE_STARTED:
    case DRAFT_PREVIEW_STARTED:
    case 'DRAFT_SUBMIT_REVIEW_STARTED':
      return {
        ...state,
        actionState: action.type,
        actionStateExtra: {},
      };
    case RESERVE_PID_STARTED:
    case DISCARD_PID_STARTED:
      return {
        ...state,
        actionState: action.type,
        actionStateExtra: { pidType: action.payload.pidType },
      };
    case DRAFT_SAVE_SUCCEEDED:
    case RESERVE_PID_SUCCEEDED:
    case DISCARD_PID_SUCCEEDED:
    case 'SAVE_REVIEW_READ_DRAFT_SUCCEEDED':
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        errors: {},
        actionState: action.type,
        actionStateExtra: {},
      };

    case DRAFT_SAVE_PARTIALLY_SUCCEEDED:
    case DRAFT_PUBLISH_PARTIALLY_SUCCEEDED:
    case DRAFT_PREVIEW_PARTIALLY_SUCCEEDED:
    case 'DRAFT_SUBMIT_REVIEW_PARTIALLY_SUCCEEDED':
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        errors: { ...action.payload.errors },
        actionState: action.type,
        actionStateExtra: {},
      };
    case DRAFT_SAVE_FAILED:
    case DRAFT_PUBLISH_FAILED:
    case DRAFT_DELETE_FAILED:
    case DRAFT_PREVIEW_FAILED:
    case RESERVE_PID_FAILED:
    case DISCARD_PID_FAILED:
    case 'DRAFT_SUBMIT_REVIEW_FAILED':
      return {
        ...state,
        errors: { ...action.payload.errors },
        actionState: action.type,
        actionStateExtra: {},
      };
    default:
      return state;
  }
};

export default depositReducer;
