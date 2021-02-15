// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';
import { DateTime } from 'luxon';

import { embargoSection, filesSection, MessageSection, MetadataSection } from './utils';

// Fully embargoed
export class Embargoed {
  constructor(hasFiles, embargo) {
    this.embargo = embargo;
    this.hasFiles = hasFiles;
  }

  renderMetadataSection() {
    return <MetadataSection isPublic={false} />;
  }

  renderFilesSection() {
    // Same as Restricted
    const filesStyle = {
      opacity: "0.5",
      cursor: "default !important"
    };
    let filesContent;
    if (this.hasFiles) {
      filesContent = <p style={{...filesStyle, textAlign: "center"}}><em>The full record is set to restricted.</em></p>;
    } else {
      filesContent = <p style={{...filesStyle, textAlign: "center"}}><em>The record has no files.</em></p>;
    }

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
      this.hasFiles
      // TODO: record / record and the files can be DRYed
      ? <>On <b>{fmtDate}</b> the record and the files will automatically be made publicly accessible. Until then, the record and the files can <b>only</b> be accessed by <b>users specified</b> in the permissions.</>
      : <>On <b>{fmtDate}</b> the record will automatically be made publicly accessible. Until then, the record can <b>only</b> be accessed by <b>users specified</b> in the permissions.</>
    );

    return <MessageSection
      intent={{warning: true}}
      icon="lock"
      title="Embargoed (full record)"
      text={text}
    />;
  }

  renderEmbargoSection() {
    return embargoSection(this.embargo);
  }

}
