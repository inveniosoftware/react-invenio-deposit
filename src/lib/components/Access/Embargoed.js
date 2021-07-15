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
      <>
        {/* TODO: use of Trans Component for jsx translations */}
        {i18next.t('On')} <b>{fmtDate}</b>{' '}
        {i18next.t(
          'the record and the files will automatically be made publicly accessible. Until then, the record and the files can'
        )}{' '}
        <b>{i18next.t('only')}</b> {i18next.t('be accessed by')}{' '}
        <b>{i18next.t('users specified')}</b> {i18next.t('in the permissions.')}
      </>
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
