// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { FastField } from 'formik';
import _debounce from 'lodash/debounce';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FieldLabel } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Form, Popup, Radio } from 'semantic-ui-react';
import {
  discardPID,
  discardExternalPID,
  reservePID,
} from '../../state/actions';
import { i18next } from '@translations/i18next';

const PROVIDER_EXTERNAL = 'external';
const UPDATE_PID_DEBOUNCE_MS = 200;

/**
 * Button component to reserve a PID.
 */
class ReservePIDBtn extends Component {
  render() {
    const { disabled, handleReservePID, label, loading } = this.props;
    return (
      <Form.Button
        type="button"
        color="green"
        size="mini"
        loading={loading}
        disabled={disabled || loading}
        onClick={handleReservePID}
        content={label}
      />
    );
  }
}

ReservePIDBtn.propTypes = {
  disabled: PropTypes.bool,
  handleReservePID: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

ReservePIDBtn.defaultProps = {
  disabled: false,
  loading: false,
};

/**
 * Button component to unreserve a PID.
 */
class UnreservePIDBtn extends Component {
  render() {
    const { disabled, handleDiscardPID, label, loading } = this.props;
    return (
      <Popup
        content={label}
        trigger={
          <Form.Button
            type="button"
            disabled={disabled || loading}
            loading={loading}
            icon="close"
            onClick={handleDiscardPID}
            size="mini"
          />
        }
      />
    );
  }
}

UnreservePIDBtn.propTypes = {
  disabled: PropTypes.bool,
  handleDiscardPID: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

UnreservePIDBtn.defaultProps = {
  disabled: false,
  loading: false,
};

/**
 * Manage radio buttons choices between managed
 * and unmanaged PID.
 */
class ManagedUnmanagedSwitch extends Component {
  handleChange = (e, { value }) => {
    const { onManagedUnmanagedChange } = this.props;
    const isManagedSelected = value === 'managed' ? true : false;
    onManagedUnmanagedChange(isManagedSelected);
  };

  render() {
    const { disabled, isManagedSelected, pidLabel } = this.props;

    return (
      <Form.Group inline>
        <Form.Field>
          {i18next.t('Do you already have a {{pidLabel}} for this upload?', {
            pidLabel: pidLabel,
          })}
        </Form.Field>
        <Form.Field width={2}>
          <Radio
            label={i18next.t('Yes')}
            name="radioGroup"
            value={PROVIDER_EXTERNAL}
            disabled={disabled}
            checked={!isManagedSelected}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field width={2}>
          <Radio
            label={i18next.t('No')}
            name="radioGroup"
            value="managed"
            disabled={disabled}
            checked={isManagedSelected}
            onChange={this.handleChange}
          />
        </Form.Field>
      </Form.Group>
    );
  }
}

ManagedUnmanagedSwitch.propTypes = {
  disabled: PropTypes.bool,
  isManagedSelected: PropTypes.bool.isRequired,
  onManagedUnmanagedChange: PropTypes.func.isRequired,
};

ManagedUnmanagedSwitch.defaultProps = {
  disabled: false,
};

/**
 * Render identifier field and reserve/unreserve
 * button components for managed PID.
 */
class ManagedIdentifierComponent extends Component {
  handleReservePID = () => {
    const { actionReservePID, form, pidType } = this.props;
    actionReservePID(pidType, form);
  };

  handleDiscardPID = () => {
    const { actionDiscardPID, form, pidType } = this.props;
    actionDiscardPID(pidType, form);
  };

  render() {
    const {
      btnLabelDiscardPID,
      btnLabelGetPID,
      disabled,
      hasStoredPid,
      helpText,
      identifier,
      pidPlaceholder,
      reservePIDsLoading,
    } = this.props;

    const ReserveBtn = (
      <ReservePIDBtn
        disabled={disabled}
        label={btnLabelGetPID}
        loading={reservePIDsLoading}
        handleReservePID={this.handleReservePID}
      />
    );

    const UnreserveBtn = (
      <UnreservePIDBtn
        disabled={disabled}
        label={btnLabelDiscardPID}
        handleDiscardPID={this.handleDiscardPID}
        loading={reservePIDsLoading}
        pidType={this.props.pidType}
      />
    );

    return (
      <>
        <Form.Group inline>
          {hasStoredPid ? (
            <Form.Field>
              <label>{identifier}</label>
            </Form.Field>
          ) : (
            <Form.Field width={4}>
              <Form.Input
                disabled
                value=""
                placeholder={pidPlaceholder}
                width={16}
              />
            </Form.Field>
          )}
          <Form.Field>{hasStoredPid ? UnreserveBtn : ReserveBtn}</Form.Field>
        </Form.Group>
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

ManagedIdentifierComponent.propTypes = {
  btnLabelGetPID: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  form: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  identifier: PropTypes.string.isRequired,
  pidLabel: PropTypes.string.isRequired,
  pidPlaceholder: PropTypes.string.isRequired,
  pidType: PropTypes.string.isRequired,
  /* from Redux */
  reservePIDsLoading: PropTypes.bool,
  actionReservePID: PropTypes.func.isRequired,
  actionDiscardPID: PropTypes.func.isRequired,
};

ManagedIdentifierComponent.defaultProps = {
  disabled: false,
  helpText: null,
  reservePIDsLoading: false,
};

const mapStateToProps = (state) => ({
  reservePIDsLoading: state.deposit.reservePIDsLoading,
});

const mapDispatchToProps = (dispatch) => ({
  actionReservePID: (pidType, formik) => dispatch(reservePID(pidType, formik)),
  actionDiscardPID: (pidType, formik) => dispatch(discardPID(pidType, formik)),
});

const ManagedIdentifierCmp = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagedIdentifierComponent);

/**
 * Render identifier field to allow user to input
 * the unmanaged PID.
 */
class UnmanagedIdentifierComponent extends Component {
  constructor(props) {
    super(props);

    const { identifier } = props;

    this.state = {
      localIdentifier: identifier,
    };
  }

  handleDiscardPID = () => {
    const { actionDiscardPID, form, onIdentifierChanged, pidType } = this.props;
    onIdentifierChanged('');
    actionDiscardPID(pidType, form);
  };

  onChange = (value) => {
    const { onIdentifierChanged } = this.props;
    this.setState({ localIdentifier: value }, () => onIdentifierChanged(value));
  };

  componentDidUpdate(prevProps) {
    // called after the form field is updated and therefore re-rendered.
    if (this.props.identifier !== prevProps.identifier) {
      this.setState({ localIdentifier: this.props.identifier });
    }
  }

  render() {
    const { localIdentifier } = this.state;
    const {
      btnLabelDiscardPID,
      hasStoredPid,
      helpText,
      identifier,
      pidPlaceholder,
      reservePIDsLoading,
    } = this.props;

    const UnreserveBtn = (
      <UnreservePIDBtn
        label={btnLabelDiscardPID}
        handleDiscardPID={this.handleDiscardPID}
        loading={reservePIDsLoading}
        pidType={this.props.pidType}
      />
    );

    return (
      <>
        <Form.Group inline>
          <Form.Field width={8}>
            {hasStoredPid ? (
              <>
                <Form.Field>
                  <label>{identifier}</label>
                </Form.Field>
                <Form.Field>{UnreserveBtn}</Form.Field>
              </>
            ) : (
              <Form.Input
                onChange={(e, { value }) => this.onChange(value)}
                value={localIdentifier}
                placeholder={pidPlaceholder}
                width={16}
              />
            )}
          </Form.Field>
        </Form.Group>
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

UnmanagedIdentifierComponent.propTypes = {
  hasStoredPid: PropTypes.bool.isRequired,
  helpText: PropTypes.string,
  identifier: PropTypes.string.isRequired,
  onIdentifierChanged: PropTypes.func.isRequired,
  pidPlaceholder: PropTypes.string.isRequired,
};

UnmanagedIdentifierComponent.defaultProps = {
  helpText: null,
};

const mapUnmanagedIdentifierDispatchToProps = (dispatch) => ({
  actionDiscardPID: (pidType, formik) =>
    dispatch(discardExternalPID(pidType, formik)),
});

const UnmanagedIdentifierCmp = connect(
  null,
  mapUnmanagedIdentifierDispatchToProps
)(UnmanagedIdentifierComponent);

/**
 * Render managed or unamanged PID fields and update
 * Formik form on input changed.
 * The field value has the following format:
 * { 'doi': { identifier: '<value>', provider: '<value>', client: '<value>' } }
 */
class CustomPIDFieldComponent extends Component {
  constructor(props) {
    super(props);

    const { canBeManaged, canBeUnmanaged } = this.props;
    this.canBeManagedAndUnmanaged = canBeManaged && canBeUnmanaged;

    this.state = {
      isManagedSelected: undefined,
    };
  }

  onExternalIdentifierChanged = (identifier) => {
    const { form, fieldPath } = this.props;

    const pid = {
      identifier: identifier,
      provider: PROVIDER_EXTERNAL,
    };

    this.debounced && this.debounced.cancel();
    this.debounced = _debounce(() => {
      form.setFieldValue(fieldPath, pid);
    }, UPDATE_PID_DEBOUNCE_MS);
    this.debounced();
  };

  render() {
    const { isManagedSelected } = this.state;
    const {
      backendStoredPids,
      btnLabelDiscardPID,
      btnLabelGetPID,
      canBeManaged,
      canBeUnmanaged,
      form,
      fieldPath,
      isEditingPublishedRecord,
      managedHelpText,
      pidLabel,
      pidIcon,
      pidPlaceholder,
      required,
      unmanagedHelpText,
      pidType,
      field,
    } = this.props;

    const value = field.value || {};
    const currentIdentifier = value.identifier || '';
    const currentProvider = value.provider || '';
    const backendStoredPid = backendStoredPids?.[pidType];
    const hasStoredExternalPid =
      backendStoredPid?.provider === PROVIDER_EXTERNAL;
    const hasStoredManagedPid =
      !_isEmpty(backendStoredPid) && !hasStoredExternalPid;

    let managedIdentifier = '',
      unmanagedIdentifier = '';
    if (currentIdentifier !== '') {
      const isProviderExternal = currentProvider === PROVIDER_EXTERNAL;
      managedIdentifier = !isProviderExternal ? currentIdentifier : '';
      unmanagedIdentifier = isProviderExternal ? currentIdentifier : '';
    }
    const hasManagedIdentifier = managedIdentifier !== '';
    const _isManagedSelected =
      isManagedSelected === undefined
        ? hasManagedIdentifier
        : isManagedSelected;

    return (
      <>
        <Form.Field required={required}>
          <FieldLabel htmlFor={fieldPath} icon={pidIcon} label={pidLabel} />
        </Form.Field>

        {this.canBeManagedAndUnmanaged && (
          <ManagedUnmanagedSwitch
            disabled={hasStoredManagedPid || hasStoredExternalPid}
            isManagedSelected={_isManagedSelected}
            onManagedUnmanagedChange={(userSelectedManaged) => {
              this.setState({
                isManagedSelected: userSelectedManaged,
              });
            }}
            pidLabel={pidLabel}
          />
        )}

        {canBeManaged && _isManagedSelected && (
          <ManagedIdentifierCmp
            disabled={isEditingPublishedRecord && hasStoredManagedPid}
            btnLabelDiscardPID={btnLabelDiscardPID}
            btnLabelGetPID={btnLabelGetPID}
            form={form}
            identifier={managedIdentifier}
            hasStoredPid={hasStoredManagedPid}
            helpText={managedHelpText}
            pidPlaceholder={pidPlaceholder}
            pidType={pidType}
            pidLabel={pidLabel}
          />
        )}

        {canBeUnmanaged && !_isManagedSelected && (
          <UnmanagedIdentifierCmp
            btnLabelDiscardPID={btnLabelDiscardPID}
            hasStoredPid={hasStoredExternalPid}
            identifier={unmanagedIdentifier}
            form={form}
            onIdentifierChanged={(identifier) => {
              this.onExternalIdentifierChanged(identifier);
            }}
            pidPlaceholder={pidPlaceholder}
            pidType={pidType}
            helpText={unmanagedHelpText}
          />
        )}
      </>
    );
  }
}

CustomPIDFieldComponent.propTypes = {
  btnLabelDiscardPID: PropTypes.string.isRequired,
  btnLabelGetPID: PropTypes.string.isRequired,
  canBeManaged: PropTypes.bool.isRequired,
  canBeUnmanaged: PropTypes.bool.isRequired,
  fieldPath: PropTypes.string.isRequired,
  isEditingPublishedRecord: PropTypes.bool.isRequired,
  managedHelpText: PropTypes.string,
  pidIcon: PropTypes.string.isRequired,
  pidLabel: PropTypes.string.isRequired,
  pidPlaceholder: PropTypes.string.isRequired,
  pidType: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  unmanagedHelpText: PropTypes.string,
};

CustomPIDFieldComponent.defaultProps = {
  managedHelpText: null,
  unmanagedHelpText: null,
};

const mapCustomPIDFieldStateToProps = (state) => ({
  backendStoredPids: state.deposit.record?.pids,
});

const mapCustomPIDFieldDispatchToProps = (dispatch) => ({
  actionDiscardPID: (pidType, formik) =>
    dispatch(discardExternalPID(pidType, formik)),
});

const CustomPIDFieldCmp = connect(
  mapCustomPIDFieldStateToProps,
  mapCustomPIDFieldDispatchToProps
)(CustomPIDFieldComponent);

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
    const { canBeManaged, canBeUnmanaged, fieldPath } = this.props;

    if (!canBeManaged && !canBeUnmanaged) {
      throw Error(`${fieldPath} must be managed, unmanaged or both.`);
    }
  };

  render() {
    const { fieldPath } = this.props;

    return (
      <FastField
        name={fieldPath}
        component={CustomPIDFieldCmp}
        {...this.props}
      />
    );
  }
}

PIDField.propTypes = {
  btnLabelDiscardPID: PropTypes.string,
  btnLabelGetPID: PropTypes.string,
  canBeManaged: PropTypes.bool,
  canBeUnmanaged: PropTypes.bool,
  fieldPath: PropTypes.string.isRequired,
  isEditingPublishedRecord: PropTypes.bool.isRequired,
  managedHelpText: PropTypes.string,
  pidIcon: PropTypes.string,
  pidLabel: PropTypes.string.isRequired,
  pidPlaceholder: PropTypes.string,
  pidType: PropTypes.string.isRequired,
  required: PropTypes.bool,
  unmanagedHelpText: PropTypes.string,
};

PIDField.defaultProps = {
  btnLabelDiscardPID: 'Discard',
  btnLabelGetPID: 'Reserve',
  canBeManaged: true,
  canBeUnmanaged: true,
  managedHelpText: null,
  pidIcon: 'barcode',
  pidPlaceholder: '',
  required: false,
  unmanagedHelpText: null,
};
