// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _setIn from 'lodash/set';
import {
  DISCARD_PID_STARTED,
  FORM_ACTION_EVENT_EMITTED,
  FORM_PUBLISHING,
  FORM_SAVING,
  RESERVE_PID_STARTED,
} from '../types';

export const publish = (record, formik) => {
  return (dispatch, getState, config) => {
    const controller = config.controller;
    return controller.publishDraft(record, {
      formik,
      store: { dispatch, getState, config },
    });
  };
};

export const save = (record, formik) => {
  return (dispatch, getState, config) => {
    const controller = config.controller;
    return controller.saveDraft(record, {
      formik,
      store: { dispatch, getState, config },
    });
  };
};

export const submitAction = (action, event, formik) => {
  return (dispatch, getState, config) => {
    dispatch({
      type: FORM_ACTION_EVENT_EMITTED,
      payload: action,
    });
    formik.handleSubmit(event); // eventually calls submitFormData below
  };
};

export const submitFormData = (record, formik) => {
  return (dispatch, getState, config) => {
    const formState = getState().deposit.formState;
    switch (formState) {
      case FORM_SAVING:
        return dispatch(save(record, formik));
      case FORM_PUBLISHING:
        return dispatch(publish(record, formik));
      default:
        console.log(`onSubmit triggered with unknown action ${formState}`);
    }
  };
};

/**
 * Returns the function that controls draft deletion.
 *
 * This function is different from the save/publish above because this thunk
 * is independent of form submission.
 *
 * @param {object} event - click event
 * @param {object} formik - formik object
 */
export const discard = (event, formik) => {
  return (dispatch, getState, extra) => {
    const controller = extra.controller;
    const record = getState().deposit.record;
    return controller.deleteDraft(record, {
      formik,
      store: { dispatch, getState, extra },
    });
  };
};

/**
 * Reserve the PID after having saved the current draft
 * @param {string} pidType - the PID type to reserve the PID for
 * @param {object} formik- formik object
 */
export const reservePID = (pidType, formik) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;

    dispatch({
      type: RESERVE_PID_STARTED,
    });

    // FIXME: formik at this point doesn't hold the latest values but
    // still a more recent state than the one stored in redux
    const latestDraft = formik.values;
    await dispatch(save(latestDraft, formik));

    const links = getState().deposit.record.links;
    return controller.reservePID(links, pidType, {
      formik,
      store: { dispatch, getState, config },
    });
  };
};

/**
 * Discard a previously reserved PID
 * @param {string} pidType - the PID type to discard the PID for
 */
export const discardPID = (pidType, formik) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;

    dispatch({
      type: DISCARD_PID_STARTED,
    });

    // FIXME: formik at this point doesn't hold the latest values but
    // still a more recent state than the one stored in redux
    const latestDraft = formik.values;
    await dispatch(save(latestDraft, formik));

    const links = getState().deposit.record.links;
    return controller.discardPID(links, pidType, {
      formik,
      store: { dispatch, getState, config },
    });
  };
};

/**
 * Discard a previously reserved PID
 * @param {string} pidType - the PID type to discard the PID for
 */
export const discardExternalPID = (pidType, formik) => {
  return async (dispatch, getState, config) => {
    // FIXME: formik at this point doesn't hold the latest values but
    // still a more recent state than the one stored in redux
    const latestDraft = formik.values;
    // FIXME: DepositRecordSerializer trims out empty values
    // thus we cannot "discard" the external pid by passing an empty
    // payload
    _setIn(latestDraft, 'pids.doi', {});
    await dispatch(save(latestDraft, formik));
  };
};
