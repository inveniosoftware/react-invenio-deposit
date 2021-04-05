// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';

import { embargoSection, filesSection, MessageSection, MetadataSection } from './utils';

// Restricted no files
export class RestrictedMetadataOnly {
  constructor(embargo) {
    this.embargo = embargo;
  }

  renderMetadataSection() {
    // Same as embargoed
    return <MetadataSection isPublic={false} />;
  }

  renderFilesSection() {
    // Same as embargoed
    const filesStyle = {
      opacity: "0.5",
      cursor: "default !important"
    };
    let filesContent = <p style={{...filesStyle, textAlign: "center"}}><em>The record has no files.</em></p>;
    return filesSection(filesStyle, filesContent);
  }

  renderMessageSection() {
    const text = <>The record can <b>only</b> be accessed by <b>users specified</b> in the permissions.</>;

    return <MessageSection
      intent={{negative: true}}
      icon="lock"
      title="Restricted"
      text={text}
    />;

  }

  renderEmbargoSection() {
    // Same as Embargoed, same as Public
    return embargoSection(this.embargo);
  }

}
