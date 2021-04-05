// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';

import { embargoSection, filesSection, MessageSection, MetadataSection } from './utils';

// Public record no files
export class PublicMetadataOnly {
  constructor(embargo) {
    this.embargo = embargo;
  }

  renderMetadataSection() {
    return <MetadataSection isPublic={true} />;
  }

  renderFilesSection() {
    let filesStyle = {
      opacity: "0.5",
      cursor: "default !important"
    };
    let filesContent = <p style={{...filesStyle, textAlign: "center"}}><em>The record has no files.</em></p>;

    return filesSection(filesStyle, filesContent);
  }

  renderMessageSection() {
    const text = "The record is publicly accessible.";

    return <MessageSection
      intent={{positive: true}}
      icon="lock open"
      title="Public"
      text={text}
    />;
  }

  renderEmbargoSection() {
    return embargoSection(this.embargo);
  }

}
