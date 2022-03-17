// This file is part of InvenioRDM
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021-2022 Graz University of Technology.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from '@translations/i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Button, Container } from 'semantic-ui-react';
import { changeSelectedCommunity } from '../../state/actions';
import { CommunitySelectionModal } from '../CommunitySelectionModal';

class CommunityHeaderComponent extends Component {
  render() {
    const { changeSelectedCommunity, community, imagePlaceholderLink } =
      this.props;

    return (
      <Container className="community-header-outer" fluid>
        <Container className="community-header">
          {community ? (
            <>
              <div className="community-header-element">
                <Image
                  className="community-logo-header"
                  src={community.logo || imagePlaceholderLink}
                  fallbackSrc={imagePlaceholderLink}
                />
              </div>
              <div className="community-header-element">
                {community.title || community.uuid}
              </div>
            </>
          ) : (
            <div className="community-header-element">
              {i18next.t('No community selected.')}
            </div>
          )}
          <div className="community-header-element">
            <CommunitySelectionModal
              onCommunityChange={(community) => {
                changeSelectedCommunity(community);
              }}
              chosenCommunity={community}
              trigger={
                <Button
                  primary
                  size="mini"
                  className="community-header-button ml-5"
                  name="setting"
                  type="button"
                >
                  {i18next.t('Edit')}
                </Button>
              }
            />
          </div>
        </Container>
      </Container>
    );
  }
}

CommunityHeaderComponent.propTypes = {
  imagePlaceholderLink: PropTypes.string.isRequired,
  community: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = (state) => ({
  community: state.deposit.community.selected,
});

const mapDispatchToProps = (dispatch) => ({
  changeSelectedCommunity: (community) =>
    dispatch(changeSelectedCommunity(community)),
});

export const CommunityHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityHeaderComponent);
