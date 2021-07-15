// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React from 'react';

import { embargoSection, filesButtons, filesSection, MessageSection, MetadataSection } from './utils';
import { i18next } from '../../i18next';

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
    const text = (
      <>
        {/* TODO: use of Trans Component for jsx translations */}
        {i18next.t('The record is publicly accessible. The files can')}{' '}
        <b>{i18next.t('only')}</b> {i18next.t('be accessed by')}{' '}
        <b>{i18next.t('users specified')}</b> {i18next.t('in the permissions.')}
      </>
    );

    return (
      <MessageSection
        intent={{ warning: true }}
        icon="lock"
        title={i18next.t('Public with restricted files')}
        text={text}
      />
    );

  }

  renderEmbargoSection(initialAccessValues) {
    return embargoSection(initialAccessValues, this.embargo);
  }

}
