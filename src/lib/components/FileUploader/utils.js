// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';

import _isNumber from 'lodash/isNumber';

export function humanReadableBytes(bytes) {
  if (_isNumber(bytes)) {
    const kiloBytes = 1000;
    const megaBytes = 1000 * kiloBytes;
    const gigaBytes = 1000 * megaBytes;

    if (bytes < kiloBytes) {
      return <>{bytes} bytes</>;
    } else if (bytes < megaBytes) {
      return <>{(bytes / kiloBytes).toFixed(2)} Kb</>;
    } else if (bytes < gigaBytes) {
      return <>{(bytes / megaBytes).toFixed(2)} Mb</>;
    } else {
      return <>{(bytes / gigaBytes).toFixed(2)} Gb</>;
    }
  }
  return '';
}
