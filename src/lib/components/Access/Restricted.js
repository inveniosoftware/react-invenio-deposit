// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';

import { embargoSection, filesSection, messageSection, metadataSection } from './utils';

// Fully restricted
export class Restricted {
  constructor(hasFiles, embargo) {
    this.hasFiles = hasFiles;
    this.embargo = embargo;
  }

  renderMetadataSection() {
    // Same as embargoed
    return metadataSection(false);
  }

  renderFilesSection() {
    // Same as embargoed
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
    const text = (
      this.hasFiles
      // TODO: record / record and the files can be DRYed
      ? <>The record and files can <b>only</b> be accessed by <b>users specified</b> in the permissions.</>
      : <>The record can <b>only</b> be accessed by <b>users specified</b> in the permissions.</>
    );

    return messageSection({negative: true}, "lock", "Restricted", text);
  }

  renderEmbargoSection() {
    // Same as Embargoed, same as Public
    return embargoSection(this.embargo);
  }

}
