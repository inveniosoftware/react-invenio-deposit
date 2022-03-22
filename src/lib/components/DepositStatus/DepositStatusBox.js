// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Icon, Item, Popup } from 'semantic-ui-react';
import { i18next } from '@translations/i18next';
import { DepositStatus } from '../../state/reducers/deposit';

const STATUSES = {
  [DepositStatus.IN_REVIEW]: {
    feedback: 'yellow',
    title: i18next.t('Pending review'),
    message: i18next.t(
      'Community curators are able to edit your record. Once they accept, your upload will be published.'
    ),
  },
  [DepositStatus.DECLINED]: {
    feedback: 'red',
    title: i18next.t('Declined'),
    message: i18next.t('The request associated with this upload was declined.'),
  },
  [DepositStatus.EXPIRED]: {
    feedback: 'purple',
    title: i18next.t('Expired'),
    message: i18next.t('The request associated with this upload has expired.'),
  },
  [DepositStatus.PUBLISHED]: {
    feedback: 'green',
    title: i18next.t('Published'),
    message: i18next.t('Your upload is published.'),
  },
  [DepositStatus.DRAFT_WITH_REVIEW]: {
    feedback: 'yellow',
    title: i18next.t('Unpublished'),
    message: i18next.t(
      'Once your upload is complete you can submit it for review to the community curators.'
    ),
  },
  [DepositStatus.DRAFT]: {
    feedback: 'yellow',
    title: i18next.t('Unpublished'),
    message: i18next.t(
      'Once your upload is complete you can submit it for review to the community curators.'
    ),
  },
};

const DepositStatusBoxComponent = ({ depositReview, depositStatus }) => {
  const status = STATUSES[depositStatus];
  if (!status) {
    throw new Error('Status is undefined');
  }

  return (
    <Card.Content className={`background ${status.feedback}`}>
      <Card.Header textAlign="center">
        <Item>
          <Item.Content verticalAlign="middle">
            <Item.Header>
              <Popup
                trigger={<Icon name="info circle" />}
                content={status.message}
              />
              {status.title}
            </Item.Header>
            {depositStatus === DepositStatus.IN_REVIEW && (
              <Button
                icon
                labelPosition="left"
                href={`/me/requests/${depositReview.id}`}
                target="_blank"
                fluid
              >
                <Icon name="eye" />
                {i18next.t('View request')}
              </Button>
            )}
          </Item.Content>
        </Item>
      </Card.Header>
    </Card.Content>
  );
};

const mapStateToProps = (state) => ({
  depositStatus: state.deposit.record.status,
  depositReview:
    state.deposit.record.status !== DepositStatus.DRAFT &&
    state.deposit.record.parent.review,
});

export const DepositStatusBox = connect(
  mapStateToProps,
  null
)(DepositStatusBoxComponent);
