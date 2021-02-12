// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.


export class Embargo {
  // NOTE: Babel should be able to make this run on all browsers. To see.
  static DISABLED = "disabled";
  static ENABLED = "enabled";
  static APPLIED = "applied";
  static LIFTED = "lifted";

  constructor({state, date, reason}) {
    this.state = state || Embargo.DISABLED;
    this.date = date || "";
    this.reason = reason || "";
  }

  static stateFrom(metadataPublic, filesPublic, applied, lifted) {
    if (applied) {
      return Embargo.APPLIED;
    } else if (lifted) {
      return Embargo.LIFTED;
    } else if (!metadataPublic || !filesPublic) {
      return Embargo.ENABLED;
    } else {
      return Embargo.DISABLED;
    }
  }

  is(state) {
    return this.state === state;
  }
}
