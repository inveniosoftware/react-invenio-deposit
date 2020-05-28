// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon } from 'semantic-ui-react';

import { ArrayField, TextField, GroupField } from 'react-invenio-forms';

/**
 * Renders a `titles` field with a schema of
 *  titles: [
 *      {
 *          'title': <string>,
 *          'type': <string>,
 *          'lang': <string>
 *      }
 *  ]
 */
export class TitlesField extends Component {
  render() {
    const {
      fieldPath,
      label,
      labelIcon,
      languageSegment,
      titleSegment,
      typeSegment,
    } = this.props;
    const defaultNewValue = {
      [languageSegment]: '',
      [titleSegment]: '',
      [typeSegment]: '',
    };
    return (
      <ArrayField
        addButtonLabel={'Add another title'}
        defaultNewValue={defaultNewValue}
        fieldPath={fieldPath}
        label={label}
        labelIcon={labelIcon}
        required
      >
        {({ array, arrayHelpers, indexPath, key }) => (
          <GroupField widths="equal" fieldPath={fieldPath}>
            <TextField
              fieldPath={`${key}.${titleSegment}`}
              label={'Title'}
              required
            />
            <TextField
              fieldPath={`${key}.${typeSegment}`}
              label={'Type'}
              required
            />
            <TextField
              fieldPath={`${key}.${languageSegment}`}
              label={'Language'}
            />
            {array.length !== 1 && (
              <Button icon>
                <Icon
                  name="close"
                  size="large"
                  onClick={() => arrayHelpers.remove(indexPath)}
                />
              </Button>
            )}
          </GroupField>
        )}
      </ArrayField>
    );
  }
}

TitlesField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  options: PropTypes.shape({
    type: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }),
  languageSegment: PropTypes.string.isRequired,
  titleSegment: PropTypes.string.isRequired,
  typeSegment: PropTypes.string.isRequired,
};

TitlesField.defaultProps = {
  languageSegment: 'lang',
  titleSegment: 'title',
  typeSegment: 'type',
};

// TODO: Pass options to TitlesField
