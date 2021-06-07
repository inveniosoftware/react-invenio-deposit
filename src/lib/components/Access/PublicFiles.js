// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';

import { embargoSection, filesButtons, filesSection, MessageSection, MetadataSection } from './utils';

// Fully public (metadata + files)
export class PublicFiles {
  constructor(embargo) {
    this.embargo = embargo;
  }

  renderMetadataSection() {
    return <MetadataSection isPublic={true} />;
  }

  renderFilesSection() {
    let filesStyle = {};
    let filesContent = filesButtons(true);
    return filesSection(filesStyle, filesContent);
  }

  renderMessageSection() {
    const text = "The record and files are publicly accessible.";

    return <MessageSection
      intent={{positive: true}}
      icon="lock open"
      title="Public"
      text={text}
    />;
  }

  renderEmbargoSection(initialAccessValues) {
    return embargoSection(initialAccessValues, this.embargo);
  }

}
