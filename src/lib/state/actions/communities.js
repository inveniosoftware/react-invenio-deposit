// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { SET_COMMUNITY } from '../types';
import { saveDraftWithUrlUpdate, saveReview } from './deposit';

export const setCommunity = (community, draft) => {
  return async (dispatch, getState, config) => {
    dispatch({
      type: SET_COMMUNITY,
      payload: community,
    });
    let response;
    // First save current draft
    try {
      response = await saveDraftWithUrlUpdate(draft, config.service.drafts);
    } catch (error) {
      dispatch({
        type: 'SAVE_REVIEW_SAVE_DRAFT_FAILED',
        payload: { errors: error.errors },
      });
    }
    const savedDraft = response.data;
    const backendReviewCommunity =
      savedDraft.parent?.review?.receiver?.community;
    // Create review request if user selected a community other than the saved
    // one
    if (community.uuid !== backendReviewCommunity) {
      response = await saveReview(
        community.uuid,
        savedDraft,
        config.service.drafts,
        {
          dispatchFn: dispatch,
          failType: 'SAVE_REVIEW_FAILED',
        }
      );

      dispatch({
        type: 'SAVE_REVIEW_SUCCEEDED',
        payload: { data: response.data },
      });
    }
    // Fetch new draft
    try {
      response = await config.service.drafts.read(savedDraft);
      dispatch({
        type: 'SAVE_REVIEW_READ_DRAFT_SUCCEEDED',
        payload: { data: response.data },
      });
    } catch (error) {
      dispatch({
        type: 'SAVE_REVIEW_READ_DRAFT_FAILED',
        payload: { errors: error.errors },
      });
    }
  };
};
