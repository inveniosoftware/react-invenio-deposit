// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';

import { embargoSection, filesButtons, filesSection, MessageSection, MetadataSection } from './utils';

// Public record restricted files
export class RestrictedFiles {
  constructor(embargo) {
    this.embargo = embargo;
  }

  renderMetadataSection() {
    // Same as Public
    return <MetadataSection isPublic={true} />;
  }

  renderFilesSection() {
    // Same as EmbargoedFiles
    let filesStyle = {};
    let filesContent = filesButtons(false);

    return filesSection(filesStyle, filesContent);
  }

  renderMessageSection() {
    const text = <>The record is publicly accessible. The files can <b>only</b> be accessed by <b>users specified</b> in the permissions.</>;

    return <MessageSection
      intent={{warning: true}}
      icon="lock"
      title="Public with restricted files"
      text={text}
    />;

  }

  renderEmbargoSection(initialAccessValues) {
    return embargoSection(initialAccessValues, this.embargo);
  }

}
