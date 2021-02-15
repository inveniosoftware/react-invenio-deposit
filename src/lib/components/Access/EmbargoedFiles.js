// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';
import { DateTime } from 'luxon';

import { embargoSection, filesButtons, filesSection, MessageSection, MetadataSection } from './utils';

// Public record embargoed files
export class EmbargoedFiles {
  constructor(embargo) {
    this.embargo = embargo;
  }

  renderMetadataSection() {
    return <MetadataSection isPublic={true} />;
  }

  renderFilesSection() {
    let filesStyle = {};
    let filesContent = filesButtons(false);

    return filesSection(filesStyle, filesContent);
  }

  renderMessageSection() {
    const fmtDate = (
      this.embargo.date
      ? DateTime.fromISO(this.embargo.date)
        .toLocaleString(DateTime.DATE_FULL) // e.g. June 21, 2021
      : "???"
    );

    const text = (
      <>The record is publicly accessible. On <b>{fmtDate}</b> the files will automatically be made publicly accessible. Until then, the files can <b>only</b> be accessed by <b>users specified</b> in the permissions.</>
    );

    return <MessageSection
      intent={{warning: true}}
      icon="lock"
      title="Embargoed (files-only)"
      text={text}
    />;
  }

  renderEmbargoSection() {
    return embargoSection(this.embargo);
  }

}
