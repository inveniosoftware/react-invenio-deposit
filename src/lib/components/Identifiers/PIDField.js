// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { FastField } from 'formik';
import _debounce from 'lodash/debounce';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FieldLabel } from 'react-invenio-forms';
import { Form, Radio } from 'semantic-ui-react';

const PROVIDER_EXTERNAL = 'external';
const UPDATE_PID_DEBOUNCE_MS = 200;

/**
 * Button component to reserve a PID.
 */
class ReservePIDBtn extends Component {
  handleClickReservePID = () => {
    const { onPIDReserved } = this.props;
    //PIDS-FIXME
    console.log('TODO implement reserve PID');
    const value = '10.1234/as7r3-234f3';
    onPIDReserved(value);
  };

  render() {
    const { disabled, label } = this.props;
    return (
      <Form.Button
        color="green"
        size="mini"
        disabled={disabled}
        onClick={this.handleClickReservePID}
        content={label}
      />
    );
  }
}

ReservePIDBtn.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onPIDReserved: PropTypes.func.isRequired,
};

ReservePIDBtn.defaultProps = {
  disabled: false,
};

/**
 * Button component to unreserve a PID.
 */
class UnreservePIDBtn extends Component {
  unreserve = (identifier) => {
    const { onPIDUnreserved } = this.props;
    //PIDS-FIXME
    console.log('TODO implement unreserve PID', identifier);
    onPIDUnreserved();
  };

  render() {
    const { identifier } = this.props;
    return (
      <Form.Button icon="close" onClick={() => this.unreserve(identifier)} />
    );
  }
}

UnreservePIDBtn.propTypes = {
  identifier: PropTypes.string.isRequired,
  onPIDUnreserved: PropTypes.func.isRequired,
};

/**
 * Manage radio buttons choices between managed
 * and unmanaged PID.
 */
class ManagedUnmanagedSwitch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isManagedSelected: false,
    };
  }

  handleChange = (e, { value }) => {
    const { onManagedUnmanagedChange } = this.props;
    const isManagedSelected = value === 'managed' ? true : false;
    this.setState({ isManagedSelected: isManagedSelected });
    onManagedUnmanagedChange(isManagedSelected);
  };

  render() {
    const { isManagedSelected } = this.state;
    const { pidLabel } = this.props;

    return (
      <Form.Group inline>
        <Form.Field>
          Do you already have a {pidLabel} for this document?
        </Form.Field>
        <Form.Field width={2}>
          <Radio
            label="Yes"
            name="radioGroup"
            value="unmanaged"
            checked={!isManagedSelected}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field width={2}>
          <Radio
            label="No"
            name="radioGroup"
            value="managed"
            checked={isManagedSelected}
            onChange={this.handleChange}
          />
        </Form.Field>
      </Form.Group>
    );
  }
}

ManagedUnmanagedSwitch.propTypes = {
  onManagedUnmanagedChange: PropTypes.func.isRequired,
};

/**
 * Render identifier field and reserve/unreserve
 * button components for managed PID.
 */
class ManagedIdentifierCmp extends Component {
  render() {
    const {
      btnLabelGetPID,
      helpText,
      identifier,
      onIdentifierChanged,
      pidPlaceholder,
    } = this.props;
    const hasIdentifier = identifier !== '';

    const ReserveBtn = (
      <ReservePIDBtn
        disabled={hasIdentifier}
        label={btnLabelGetPID}
        onPIDReserved={(value) => onIdentifierChanged(value)}
      />
    );

    const UnreserveBtn = (
      <UnreservePIDBtn
        identifier={identifier}
        onPIDUnreserved={() => onIdentifierChanged('')}
      />
    );

    return (
      <>
        <Form.Group inline>
          <Form.Field width={8}>
            {hasIdentifier ? (
              <label>{identifier}</label>
            ) : (
              <>
                <Form.Input
                  disabled
                  value=""
                  placeholder={pidPlaceholder}
                  width={16}
                />
              </>
            )}
          </Form.Field>
          <Form.Field>{identifier ? UnreserveBtn : ReserveBtn}</Form.Field>
        </Form.Group>
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

ManagedIdentifierCmp.propTypes = {
  btnLabelGetPID: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  identifier: PropTypes.string.isRequired,
  onIdentifierChanged: PropTypes.func.isRequired,
  pidPlaceholder: PropTypes.string.isRequired,
};

ManagedIdentifierCmp.defaultProps = {
  helpText: null,
};

/**
 * Render identifier field to allow user to input
 * the unmanaged PID.
 */
class UnmanagedIdentifierCmp extends Component {
  render() {
    const {
      helpText,
      identifier,
      onIdentifierChanged,
      pidPlaceholder,
    } = this.props;

    return (
      <>
        <Form.Field width={8}>
          <Form.Input
            onChange={(e, { value }) => onIdentifierChanged(value)}
            value={identifier}
            placeholder={pidPlaceholder}
            width={16}
          />
        </Form.Field>
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

UnmanagedIdentifierCmp.propTypes = {
  helpText: PropTypes.string,
  identifier: PropTypes.string.isRequired,
  onIdentifierChanged: PropTypes.func.isRequired,
  pidPlaceholder: PropTypes.string.isRequired,
};

UnmanagedIdentifierCmp.defaultProps = {
  helpText: null,
};

/**
 * Render managed or unamanged PID fields and update
 * Formik form on input changed.
 * The field value has the following format:
 * { 'doi': { identifier: '<value>', provider: '<value>', client: '<value>' } }
 */
class CustomPIDField extends Component {
  constructor(props) {
    super(props);

    const { canBeManaged, canBeUnmanaged, field } = this.props;
    this.canBeManagedAndUnmanaged = canBeManaged && canBeUnmanaged;

    // init state
    const canBeOnlyManaged = canBeManaged && !canBeUnmanaged;

    const currentIdentifier = _get(field.value, 'identifier', '');
    let managedIdentifier = '',
      unmanagedIdentifier = '';
    if (currentIdentifier !== '') {
      const currentProvider = _get(field.value, 'provider', '');
      const isProviderExternal = currentProvider === PROVIDER_EXTERNAL;
      managedIdentifier = !isProviderExternal ? currentIdentifier : '';
      unmanagedIdentifier = isProviderExternal ? currentIdentifier : '';
    }

    this.state = {
      isManagedSelected: canBeOnlyManaged || false,
      managedIdentifier: managedIdentifier,
      unmanagedIdentifier: unmanagedIdentifier,
    };
  }

  updateIdentifer = (form, fieldPath, pid) => {
    this.debounced && this.debounced.cancel();
    this.debounced = _debounce(() => {
      //PIDS-FIXME
      console.log('TODO implement onIdentifierChange', pid);
      form.setFieldValue(fieldPath, pid);
    }, UPDATE_PID_DEBOUNCE_MS);
    this.debounced();
  };

  buildUnmanagedPid = (identifier) => {
    return { identifier: identifier, provider: PROVIDER_EXTERNAL };
  };

  buildManagedPid = (identifier, provider) => {
    const { pidClient } = this.props;
    const pidValue = {
      identifier: identifier,
    };

    if (identifier) {
      pidValue.provider = provider;
      pidValue.client = pidClient;
    }
    return pidValue;
  };

  buildPid = (isManagedSelected, managedIdentifier, unmanagedIdentifier) => {
    const { pidProvider } = this.props;
    return isManagedSelected
      ? this.buildManagedPid(managedIdentifier, pidProvider)
      : this.buildUnmanagedPid(unmanagedIdentifier);
  };

  render() {
    const {
      isManagedSelected,
      managedIdentifier,
      unmanagedIdentifier,
    } = this.state;
    const {
      btnLabelGetPID,
      form,
      fieldPath,
      managedHelpText,
      pidLabel,
      pidIcon,
      pidPlaceholder,
      required,
      unmanagedHelpText,
    } = this.props;
    return (
      <>
        <Form.Field required={required}>
          <FieldLabel htmlFor={fieldPath} icon={pidIcon} label={pidLabel} />
        </Form.Field>

        {this.canBeManagedAndUnmanaged && (
          <ManagedUnmanagedSwitch
            onManagedUnmanagedChange={(isManagedSelected) => {
              this.setState({
                isManagedSelected: isManagedSelected,
              });
              const pid = this.buildPid(
                isManagedSelected,
                managedIdentifier,
                unmanagedIdentifier
              );
              this.updateIdentifer(form, fieldPath, pid);
            }}
            pidLabel={pidLabel}
          />
        )}

        {isManagedSelected && (
          <ManagedIdentifierCmp
            btnLabelGetPID={btnLabelGetPID}
            identifier={managedIdentifier}
            helpText={managedHelpText}
            onIdentifierChanged={(value) => {
              this.setState({ managedIdentifier: value });
              const pid = this.buildPid(
                isManagedSelected,
                value,
                unmanagedIdentifier
              );
              this.updateIdentifer(form, fieldPath, pid);
            }}
            pidPlaceholder={pidPlaceholder}
          />
        )}

        {!isManagedSelected && (
          <UnmanagedIdentifierCmp
            identifier={unmanagedIdentifier}
            onIdentifierChanged={(value) => {
              this.setState({ unmanagedIdentifier: value });
              const pid = this.buildPid(
                isManagedSelected,
                managedIdentifier,
                value
              );
              this.updateIdentifer(form, fieldPath, pid);
            }}
            pidPlaceholder={pidPlaceholder}
            helpText={unmanagedHelpText}
          />
        )}
      </>
    );
  }
}

CustomPIDField.propTypes = {
  btnLabelGetPID: PropTypes.string.isRequired,
  canBeManaged: PropTypes.bool.isRequired,
  canBeUnmanaged: PropTypes.bool.isRequired,
  fieldPath: PropTypes.string.isRequired,
  managedHelpText: PropTypes.string,
  pidClient: PropTypes.string.isRequired,
  pidIcon: PropTypes.string.isRequired,
  pidLabel: PropTypes.string.isRequired,
  pidPlaceholder: PropTypes.string.isRequired,
  pidProvider: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  unmanagedHelpText: PropTypes.string,
};

CustomPIDField.defaultProps = {
  managedHelpText: null,
  unmanagedHelpText: null,
};

/**
 * Render the PIDField using a custom Formik component
 */
export class PIDField extends Component {
  constructor(props) {
    super(props);

    this.validatePropValues();

    this.state = {
      isManagedSelected: false,
    };
  }

  validatePropValues = () => {
    const {
      canBeManaged,
      canBeUnmanaged,
      fieldPath,
      pidClient,
      pidProvider,
    } = this.props;

    if (!canBeManaged && !canBeUnmanaged) {
      throw Error(`${fieldPath} must be managed, unmanaged or both.`);
    }

    const isProviderExternal = pidProvider === PROVIDER_EXTERNAL;
    if (isProviderExternal && pidClient) {
      throw Error('client prop cannot be defined when provider is external.');
    }
    if (!isProviderExternal && !pidClient) {
      throw Error('client prop must be defined.');
    }
  };

  render() {
    const {
      btnLabelGetPID,
      canBeManaged,
      canBeUnmanaged,
      managedHelpText,
      fieldPath,
      pidClient,
      pidIcon,
      pidLabel,
      pidPlaceholder,
      pidProvider,
      required,
      unmanagedHelpText,
    } = this.props;

    return (
      <FastField
        name={fieldPath}
        component={CustomPIDField}
        /* cmp props */
        btnLabelGetPID={btnLabelGetPID}
        canBeManaged={canBeManaged}
        canBeUnmanaged={canBeUnmanaged}
        managedHelpText={managedHelpText}
        fieldPath={fieldPath}
        pidClient={pidClient}
        pidIcon={pidIcon}
        pidLabel={pidLabel}
        pidPlaceholder={pidPlaceholder}
        pidProvider={pidProvider}
        required={required}
        unmanagedHelpText={unmanagedHelpText}
      />
    );
  }
}

PIDField.propTypes = {
  btnLabelGetPID: PropTypes.string,
  canBeManaged: PropTypes.bool,
  canBeUnmanaged: PropTypes.bool,
  fieldPath: PropTypes.string.isRequired,
  managedHelpText: PropTypes.string,
  pidClient: PropTypes.string,
  pidIcon: PropTypes.string,
  pidLabel: PropTypes.string.isRequired,
  pidPlaceholder: PropTypes.string,
  pidProvider: PropTypes.string,
  required: PropTypes.bool,
  unmanagedHelpText: PropTypes.string,
};

PIDField.defaultProps = {
  btnLabelGetPID: 'Reserve',
  canBeManaged: true,
  canBeUnmanaged: true,
  managedHelpText: null,
  pidClient: null,
  pidIcon: 'barcode',
  pidPlaceholder: '',
  pidProvider: PROVIDER_EXTERNAL, // when unmanaged
  required: false,
  unmanagedHelpText: null,
};
