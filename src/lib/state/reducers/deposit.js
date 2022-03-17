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
  DRAFT_FETCHED,
  DRAFT_HAS_VALIDATION_ERRORS,
  DRAFT_PREVIEW_FAILED,
  DRAFT_PREVIEW_STARTED,
  DRAFT_PUBLISH_FAILED,
  DRAFT_PUBLISH_FAILED_WITH_VALIDATION_ERRORS,
  DRAFT_PUBLISH_STARTED,
  DRAFT_SAVE_FAILED,
  DRAFT_SAVE_STARTED,
  DRAFT_SAVE_SUCCEEDED,
  DRAFT_SUBMIT_REVIEW_FAILED,
  DRAFT_SUBMIT_REVIEW_FAILED_WITH_VALIDATION_ERRORS,
  DRAFT_SUBMIT_REVIEW_STARTED,
  RESERVE_PID_FAILED,
  RESERVE_PID_STARTED,
  RESERVE_PID_SUCCEEDED,
  SET_COMMUNITY,
} from '../types';

/**
 * Given a draft and optionally a newly selected community, it computes multiple states:
 * - `isReviewForSelectedCommunity`: true if the draft has an inclusion request on the given community
 * - `isRecordInSelectedCommunity`: true if the draft is already in the given community
 * - `recordHasInclusionRequest`: true if an inclusion request exists for the draft
 *
 * Passing `null` for the `selectedCommunity` param will deselect the current community.
 * When the `selectedCommunity` param is omitted, it will retrieve the community from the draft, if any.
 *
 * @param {object} record: the latest version of the record
 * @param {object} selectedCommunity: the selected community, `null` to deselect.
 * @returns a new state for community
 */
export function computeCommunityState(record, selectedCommunity = undefined) {
  const draftReview = record?.parent?.review;
  const recordHasInclusionRequest =
    draftReview && draftReview.type === 'community-submission';

  let _selectedCommunity = selectedCommunity;
  // when value is `null`, the selected community was deselected
  if (selectedCommunity === undefined) {
    // when `undefined`, retrieve the community from the record, if previously selected
    _selectedCommunity =
      draftReview?.receiver?.community || // record has an inclusion request
      record.parent?.communities?.default; // record is already in a community
  }

  // FIXME
  // needed until backend will resolve community and return an obj instead of UUID only
  if (_selectedCommunity) {
    _selectedCommunity = {
      id: _selectedCommunity.id || _selectedCommunity,
      uuid: _selectedCommunity.uuid || _selectedCommunity,
      metadata: {
        title: _selectedCommunity?.metadata?.title || _selectedCommunity,
        description:
          _selectedCommunity?.metadata?.description || _selectedCommunity,
        type: 'Type',
      },
      links: {
        self_html: '/',
      },
    };
  }

  const isReviewForSelectedCommunity =
    _selectedCommunity &&
    recordHasInclusionRequest &&
    draftReview.receiver.community === _selectedCommunity.uuid;
  const isRecordInSelectedCommunity =
    _selectedCommunity &&
    record.parent?.communities?.ids.includes(_selectedCommunity.uuid);

  return {
    selected: _selectedCommunity,
    isReviewForSelectedCommunity: Boolean(isReviewForSelectedCommunity),
    isRecordInSelectedCommunity: Boolean(isRecordInSelectedCommunity),
    recordHasInclusionRequest: Boolean(recordHasInclusionRequest),
  };
}

const depositReducer = (state = {}, action) => {
  switch (action.type) {
    case DRAFT_SAVE_STARTED:
    case DRAFT_PUBLISH_STARTED:
    case DRAFT_DELETE_STARTED:
    case DRAFT_PREVIEW_STARTED:
      return {
        ...state,
        actionState: action.type,
      };
    case DRAFT_SUBMIT_REVIEW_STARTED:
      return {
        ...state,
        actionState: action.type,
        actionStateExtra: { reviewComment: action.payload.reviewComment },
      };
    case RESERVE_PID_STARTED:
    case DISCARD_PID_STARTED:
      return {
        ...state,
        actionState: action.type,
        actionStateExtra: { pidType: action.payload.pidType },
      };
    case DRAFT_FETCHED:
    case DRAFT_SAVE_SUCCEEDED:
    case RESERVE_PID_SUCCEEDED:
    case DISCARD_PID_SUCCEEDED:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        community: computeCommunityState(
          action.payload.data,
          state.community.selected
        ),
        errors: {},
        actionState: action.type,
        actionStateExtra: {},
      };
    case DRAFT_HAS_VALIDATION_ERRORS:
    case DRAFT_PUBLISH_FAILED_WITH_VALIDATION_ERRORS:
    case DRAFT_SUBMIT_REVIEW_FAILED_WITH_VALIDATION_ERRORS:
      return {
        ...state,
        record: { ...state.record, ...action.payload.data },
        community: computeCommunityState(
          action.payload.data,
          state.community.selected
        ),
        errors: { ...action.payload.errors },
        actionState: action.type,
      };
    case DRAFT_SAVE_FAILED:
    case DRAFT_PUBLISH_FAILED:
    case DRAFT_DELETE_FAILED:
    case DRAFT_PREVIEW_FAILED:
    case RESERVE_PID_FAILED:
    case DISCARD_PID_FAILED:
    case DRAFT_SUBMIT_REVIEW_FAILED:
      return {
        ...state,
        community: computeCommunityState(
          state.record,
          state.community.selected
        ),
        errors: { ...action.payload.errors },
        actionState: action.type,
        actionStateExtra: {},
      };
    case SET_COMMUNITY:
      return {
        ...state,
        community: computeCommunityState(
          state.record,
          action.payload.community
        ),
      };
    default:
      return state;
  }
};

export default depositReducer;
