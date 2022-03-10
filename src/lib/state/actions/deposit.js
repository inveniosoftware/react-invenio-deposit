// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _isEmpty from 'lodash/isEmpty';
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

async function changeURLAfterCreation(draftURL) {
  window.history.replaceState(undefined, '', draftURL);
}

export const saveDraftWithUrlUpdate = async (draft, draftsService) => {
  const hasAlreadyId = draft.id ? true : false;
  const response = await draftsService.save(draft);
  if (!hasAlreadyId) {
    // draft was created, change URL to add the draft PID
    const draftURL = response.data.links.self_html;
    changeURLAfterCreation(draftURL);
  }

  return response;
};

async function _saveDraft(
  draft,
  draftsService,
  { dispatchFn, failType, partialSuccessType }
) {
  let response;
  try {
    response = await saveDraftWithUrlUpdate(draft, draftsService, failType);
  } catch (error) {
    dispatchFn({
      type: failType,
      payload: { errors: error.errors },
    });
    throw error;
  }

  const isPartialSave = !_isEmpty(response.errors);
  if (isPartialSave) {
    dispatchFn({
      type: partialSuccessType,
      payload: { data: response.data, errors: response.errors },
    });
    throw response;
  }

  return response;
}

export async function saveReview(
  newCommunityUUID,
  draft,
  draftsService,
  { dispatchFn, failType }
) {
  let response;
  try {
    response = await draftsService.saveReview(newCommunityUUID, draft.links);
  } catch (error) {
    dispatchFn({
      type: failType,
      payload: { errors: error.errors },
    });
    throw error;
  }

  return response;
}

export async function readDraft(
  draft,
  draftsService,
  { dispatchFn, failType }
) {
  let response;
  try {
    response = await draftsService.readDraft(draft);
  } catch (error) {
    dispatchFn({
      type: failType,
      payload: { errors: error.errors },
    });
    throw error;
  }

  return response;
}

export const save = (draft) => {
  return async (dispatch, getState, config) => {
    dispatch({
      type: DRAFT_SAVE_STARTED,
    });
    let response;

    response = await _saveDraft(draft, config.service.drafts, {
      dispatchFn: dispatch,
      failType: DRAFT_SAVE_FAILED,
      partialSuccessType: DRAFT_SAVE_PARTIALLY_SUCCEEDED,
    });

    dispatch({
      type: DRAFT_SAVE_SUCCEEDED,
      payload: { data: response.data },
    });
  };
};

export const publish = (draft) => {
  return async (dispatch, getState, config) => {
    dispatch({
      type: DRAFT_PUBLISH_STARTED,
    });

    await _saveDraft(draft, config.service.drafts, {
      dispatchFn: dispatch,
      failType: DRAFT_PUBLISH_FAILED,
      partialSuccessType: DRAFT_PUBLISH_PARTIALLY_SUCCEEDED,
    });

    // if everything good, publish
    const draftLinks = getState().deposit.record.links;
    try {
      const response = await config.service.drafts.publish(draftLinks);
      // after publishing, redirect to the published record
      const recordURL = response.data.links.self_html;
      window.location.replace(recordURL);
    } catch (error) {
      dispatch({
        type: DRAFT_PUBLISH_FAILED,
        payload: { errors: error.errors },
      });
      throw error;
    }
  };
};

export const submitReview = (draft) => {
  return async (dispatch, getState, config) => {
    dispatch({
      type: 'DRAFT_SUBMIT_REVIEW_STARTED',
    });

    await _saveDraft(draft, config.service.drafts, {
      dispatchFn: dispatch,
      failType: 'DRAFT_SUBMIT_REVIEW_FAILED',
      partialSuccessType: 'DRAFT_SUBMIT_REVIEW_PARTIALLY_SUCCEEDED',
    });

    // if everything good, publish
    const savedDraft = getState().deposit.record;
    try {
      const response = await config.service.drafts.submitReview(
        savedDraft.links,
        savedDraft
      );
      // after submitting for review, redirect to the review record
      // FIXME: add response.data.links.self_html
      const requestURL = `/requests/${response.data.id}`;
      window.location.replace(requestURL);
    } catch (error) {
      dispatch({
        type: 'DRAFT_SUBMIT_REVIEW_FAILED',
        payload: { errors: error.errors },
      });
      throw error;
    }
  };
};

export const preview = (draft) => {
  return async (dispatch, _, config) => {
    dispatch({
      type: DRAFT_PREVIEW_STARTED,
    });

    await _saveDraft(draft, config.service.drafts, {
      dispatchFn: dispatch,
      failType: DRAFT_PREVIEW_FAILED,
      partialSuccessType: DRAFT_PREVIEW_PARTIALLY_SUCCEEDED,
    });
    // redirect to the preview page
    window.location = `/records/${draft.id}?preview=1`;
  };
};

/**
 * Returns the function that controls draft deletion.
 *
 * This function is different from the save/publish above because this thunk
 * is independent of form submission.
 */
export const delete_ = (_, { isDiscardingVersion = false }) => {
  return async (dispatch, getState, config) => {
    dispatch({
      type: DRAFT_DELETE_STARTED,
    });

    try {
      const draft = getState().deposit.record;
      const draftLinks = draft.links;
      await config.service.drafts.delete(draftLinks);

      let redirectURL;
      if (isDiscardingVersion) {
        // go back to the previous version when discarding
        redirectURL = `/records/${draft.id}`;
      } else {
        // redirect to the the uploads page after deleting a draft
        redirectURL = '/me/uploads';
      }
      window.location.replace(redirectURL);
    } catch (error) {
      dispatch({
        type: DRAFT_DELETE_FAILED,
        payload: { errors: error.errors },
      });
      throw error;
    }
  };
};

/**
 * Reserve the PID after having saved the current draft
 */
export const reservePID = (draft, { pidType }) => {
  return async (dispatch, getState, config) => {
    dispatch({
      type: RESERVE_PID_STARTED,
      payload: { pidType: pidType },
    });

    try {
      await saveDraftWithUrlUpdate(draft, config.service.drafts);

      const draftLinks = getState().deposit.record.links;
      const response = await config.service.drafts.reservePID(
        draftLinks,
        pidType
      );

      dispatch({
        type: RESERVE_PID_SUCCEEDED,
        payload: { data: response.data },
      });
    } catch (error) {
      dispatch({
        type: RESERVE_PID_FAILED,
        payload: { errors: error.errors },
      });
      throw error;
    }
  };
};

/**
 * Discard a previously reserved PID
 */
export const discardPID = (draft, { pidType }) => {
  return async (dispatch, getState, config) => {
    dispatch({
      type: DISCARD_PID_STARTED,
      payload: { pidType: pidType },
    });

    try {
      await saveDraftWithUrlUpdate(draft, config.service.drafts);

      const draftLinks = getState().deposit.record.links;
      const response = await config.service.drafts.discardPID(
        draftLinks,
        pidType
      );

      dispatch({
        type: DISCARD_PID_SUCCEEDED,
        payload: { data: response.data },
      });
    } catch (error) {
      dispatch({
        type: DISCARD_PID_FAILED,
        payload: { errors: error.errors },
      });
      throw error;
    }
  };
};
