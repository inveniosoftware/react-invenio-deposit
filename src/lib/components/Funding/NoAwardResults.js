// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from 'prop-types';
import React from 'react';
import { Message } from 'semantic-ui-react';
import { i18next } from '@translations/i18next';

export function NoAwardResults({ switchToCustom }) {
  return (
    <Message
      warning
      icon="warning circle"
      content={
        <p>
          {i18next.t('Did not find your award? ')}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchToCustom();
            }}
          >
            {i18next.t('Add a custom award.')}
          </a>
        </p>
      }
    />
  );
}

NoAwardResults.propTypes = {
  switchToCustom: PropTypes.func.isRequired,
};
