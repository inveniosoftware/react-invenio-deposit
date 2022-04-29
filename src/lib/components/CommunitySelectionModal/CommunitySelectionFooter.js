// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { Container, Divider, Segment } from 'semantic-ui-react';
import { Trans } from '@translations/i18next';

export const CommunitySelectionFooter = () => {
  return (
    <>
      <Divider hidden />
      <Container>
        <Segment textAlign="center">
          <p>
            <Trans i18nKey="Did not find a community that fits you? Upload without a community or <2> create your own.</2>">
              Did not find a community that fits you? Upload without a community
              or <a href="/communities/new">create your own.</a>
            </Trans>
          </p>
        </Segment>
      </Container>
    </>
  );
};