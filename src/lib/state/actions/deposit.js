// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { FORM_ACTION_EVENT_EMITTED } from '../types';


/**
 * Closure over Axios error and formik, returning async error setting function.
 *
 * @param {Error} error - Axios error
 * @param {Formik state} formik
 */
export const setFormErrors = (error, formik, record) => {
  return async (dispatch, getState, config) => {
    console.log("record", record);
    const extractedErrors = config.apiErrorHandler.extractErrors(error, record);
    console.log("extractedErrors", extractedErrors);
    dispatch({
      type: 'FORM_ACTION_FAILED',
    });
    formik.setSubmitting(false);
    formik.setErrors(extractedErrors);
  };
};

export const publish = (record, formik) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    controller.publish_draft(record, {
      formik,
      store: { dispatch, getState, config },
    });
  };
};

export const save = (record, formik) => {
  return async (dispatch, getState, config) => {
    const controller = config.controller;
    controller.save_draft(record, {
      formik,
      store: { dispatch, getState, config },
    });
  };
};

export const submitAction = (action, event, formik) => {
  return async (dispatch, getState, config) => {
    console.log(`onSubmit - ${action}`);
    dispatch({
      type: FORM_ACTION_EVENT_EMITTED,
      payload: action,
    });
    formik.handleSubmit(event);
  };
};

export const submitFormData = (record, formik) => {
  return async (dispatch, getState, config) => {
    const formAction = getState().deposit.formAction;
    switch (formAction) {
      case 'save':
        dispatch(save(record, formik));
        break;
      case 'publish':
        dispatch(publish(record, formik));
        break;
      default:
        console.log('onSubmit triggered some other way');
    }
  };
};
