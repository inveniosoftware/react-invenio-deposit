// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

import {
  ArrayField,
  GroupField,
  SelectField,
  RichInputField,
} from 'react-invenio-forms';
import { emptyAdditionalDescription } from '../record';

export class AdditionalDescriptionsField extends Component {
  render() {
    const { fieldPath, options } = this.props;

    return (
      <ArrayField
        addButtonLabel={'Add descriptions'}
        defaultNewValue={emptyAdditionalDescription}
        fieldPath={fieldPath}
      >
        {({ array, arrayHelpers, indexPath, key }) => (
          <>
            <RichInputField
              fieldPath={`${key}.description`}
              label={'Additional Desciption'}
              optimized={true}
              required
            />
            <GroupField widths="equal" fieldPath={fieldPath}>
              <SelectField
                fieldPath={`${key}.type`}
                label={'Type'}
                options={options.type}
                required
              />
              <SelectField
                fieldPath={`${key}.lang`}
                label={'Language'}
                options={options.lang}
                clearable
              />
              <>
                <Button icon type="button">
                  <Icon
                    name="close"
                    onClick={() => arrayHelpers.remove(indexPath)}
                  />
                </Button>
              </>
            </GroupField>
          </>
        )}
      </ArrayField>
    );
  }
}

AdditionalDescriptionsField.propTypes = {
  options: PropTypes.shape({
    type: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    lang: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }),
};

AdditionalDescriptionsField.defaultProps = {
  fieldPath: 'metadata.additional_descriptions',
};
