// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';
import { DateTime } from 'luxon';

import {
  embargoSection,
  filesButtons,
  filesSection,
  MessageSection,
  MetadataSection,
} from './utils';
import { i18next } from '@translations/i18next';
import { Trans } from '@translations/i18next';
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
    const fmtDate = this.embargo.date
      ? DateTime.fromISO(this.embargo.date).toLocaleString(DateTime.DATE_FULL) // e.g. June 21, 2021
      : '???';

    const text = (
      <Trans
        defaults="The record is publicly accessible. On <bold>{{ date }}</bold> the files will automatically be made publicly accessible. Until then, the files can <bold>only</bold> be accessed by <bold>users specified</bold> in the permissions."
        values={{ date: fmtDate }}
        components={{ bold: <b /> }}
      />
    );

    return (
      <MessageSection
        intent={{ warning: true }}
        icon="lock"
        title={i18next.t('Embargoed (files-only)')}
        text={text}
      />
    );
  }

  renderEmbargoSection(initialAccessValues) {
    return embargoSection(initialAccessValues, this.embargo);
  }
}
