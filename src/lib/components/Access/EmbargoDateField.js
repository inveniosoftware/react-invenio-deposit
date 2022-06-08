// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from 'prop-types';
import React from 'react';
import { FieldLabel, TextField } from 'react-invenio-forms';
import { i18next } from '@translations/i18next';

export function EmbargoDateField({
  fieldPath,
  label,
  labelIcon,
  placeholder,
  required,
}) {
  return (
    <TextField
      fieldPath={fieldPath}
      label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
      placeholder={placeholder}
      required={required}
    />
  );
}

EmbargoDateField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

EmbargoDateField.defaultProps = {
  fieldPath: 'access.embargo.until',
  label: i18next.t('Embargo until'),
  labelIcon: 'calendar',
  placeholder: i18next.t('YYYY-MM-DD'),
};
