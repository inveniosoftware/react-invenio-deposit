// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import {
  SET_COMMUNITY,
} from '../types';

const communityReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_COMMUNITY:
      return {
        ...state,
        community: action.payload,
      };
    default:
      return state;
  }
};

export default communityReducer;
