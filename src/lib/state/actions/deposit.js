// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import {
  FORM_ACTION_EVENT_EMITTED,
  FORM_PUBLISHING,
  FORM_SAVING,
} from '../types';

export const publish = (record, formik) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    controller.publishDraft(record, {
      formik,
      store: { dispatch, getState, config },
    });
  };
};

export const save = (record, formik) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    controller.saveDraft(record, {
      formik,
      store: { dispatch, getState, config },
    });
  };
};

export const submitAction = (action, event, formik) => {
  return async (dispatch, getState, config) => {
    dispatch({
      type: FORM_ACTION_EVENT_EMITTED,
      payload: action,
    });
    formik.handleSubmit(event); // eventually calls submitFormData below
  };
};

export const submitFormData = (record, formik) => {
  return async (dispatch, getState, config) => {
    const formState = getState().deposit.formState;
    switch (formState) {
      case FORM_SAVING:
        dispatch(save(record, formik));
        break;
      case FORM_PUBLISHING:
        dispatch(publish(record, formik));
        break;
      default:
        console.log('onSubmit triggered some other way');
    }
  };
};

/**
 * Returns the async function that controls draft deletion.
 *
 * This function is different from the save/publish above because this thunk
 * is independent of form submission.
 *
 * @param {object} event - click event
 * @param {object} formik - formik object
 */
export const discard = (event, formik) => {
  return async (dispatch, getState, extra) => {
    const controller = extra.controller;
    let record = getState().deposit.record;
    controller.deleteDraft(record, {
      formik,
      store: { dispatch, getState, extra },
    });
  }
};
