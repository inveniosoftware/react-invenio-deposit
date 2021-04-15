// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from 'prop-types';
import React from 'react';
import { Message } from 'semantic-ui-react';

export function NoAwardResults({ switchToCustom }) {
  return (
    <Message
      warning
      icon="warning circle"
      header="No results found"
      content={
        <p>
          No awards matching your criteria were found.{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchToCustom();
            }}
          >
            Add a custom award.
          </a>
        </p>
      }
    />
  );
}

NoAwardResults.propTypes = {
  switchToCustom: PropTypes.func.isRequired,
};
