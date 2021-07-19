// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';
import { i18next } from '@translations/i18next';
import { Trans } from '@translations/i18next';
import {
  embargoSection,
  filesSection,
  MessageSection,
  MetadataSection,
} from './utils';

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
      opacity: '0.5',
      cursor: 'default !important',
    };
    let filesContent = (
      <p style={{ ...filesStyle, textAlign: 'center' }}>
        <em>{i18next.t('The record has no files.')}</em>
      </p>
    );
    return filesSection(filesStyle, filesContent);
  }

  renderMessageSection() {
    const text = (
      <Trans>
        The record can <b>only</b> be accessed by <b>users specified</b> in the
        permissions.
      </Trans>
    );

    return (
      <MessageSection
        intent={{ negative: true }}
        icon="lock"
        title={i18next.t('Restricted')}
        text={text}
      />
    );
  }

  renderEmbargoSection(initialAccessValues) {
    // Same as Embargoed, same as Public
    return embargoSection(initialAccessValues, this.embargo);
  }
}
