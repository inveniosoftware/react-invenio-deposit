// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.


export class EmbargoState {
  static DISABLED = "disabled";
  static ENABLED = "enabled";
  static APPLIED = "applied";
  static LIFTED = "lifted";

  static from(metadataPublic, filesPublic, applied, lifted) {
    if (applied) {
      return EmbargoState.APPLIED;
    } else if (lifted) {
      return EmbargoState.LIFTED;
    } else if (!metadataPublic || !filesPublic) {
      return EmbargoState.ENABLED;
    } else {
      return EmbargoState.DISABLED;
    }
  }
}


export class Embargo {
  constructor({state, date, reason}) {
    this.state = state || EmbargoState.DISABLED;
    this.date = date || "";
    this.reason = reason || "";
  }

  is(state) {
    return this.state === state;
  }
}
