// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export const LicenseEmptyResults = (props) => {
  return (
    <Segment placeholder textAlign="center">
      <Header icon>
        <Icon name="search" />
        No results found!
      </Header>
      <Button
        primary
        onClick={() =>
          props.resetQuery({
            queryString: '',
            page: 1,
            filters: ['tags', 'recommended'],
          })
        }
      >
        Clear query
      </Button>
    </Segment>
  );
};
