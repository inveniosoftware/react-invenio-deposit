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
  filesSection,
  MessageSection,
  MetadataSection,
} from './utils';
import { i18next } from '../../i18next';
import { Trans } from 'react-i18next';

// Record and files embargoed
export class Embargoed {
  constructor(embargo) {
    this.embargo = embargo;
  }

  renderMetadataSection() {
    return <MetadataSection isPublic={false} />;
  }

  renderFilesSection() {
    // Same as Restricted
    const filesStyle = {
      opacity: '0.5',
      cursor: 'default !important',
    };
    let filesContent = (
      <p style={{ ...filesStyle, textAlign: 'center' }}>
        <em>{i18next.t('The full record is restricted.')}</em>
      </p>
    );
    return filesSection(filesStyle, filesContent);
  }

  renderMessageSection() {
    const fmtDate = this.embargo.date
      ? DateTime.fromISO(this.embargo.date).toLocaleString(DateTime.DATE_FULL) // e.g. June 21, 2021
      : '???';

    const text = (
      <Trans values={{ fmtDate: fmtDate}}>
        On <b>{{fmtDate}}</b> the record and the files will automatically be made publicly accessible. Until then, the record and the files can <b>only</b> be accessed by <b>users specified</b> in the permissions.
      </Trans>
    );

    return (
      <MessageSection
        intent={{ warning: true }}
        icon="lock"
        title="Embargoed (full record)"
        text={text}
      />
    );
  }

  renderEmbargoSection(initialAccessValues) {
    return embargoSection(initialAccessValues, this.embargo);
  }
}
