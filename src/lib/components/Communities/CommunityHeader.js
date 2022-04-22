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
    const {
      changeSelectedCommunity,
      community,
      imagePlaceholderLink,
      showCommunitySelectionButton,
      disableCommunitySelectionButton,
      hideCommunityHeader,
    } = this.props;

    return (
      !hideCommunityHeader && (
        <Container className="page-subheader-outer compact" fluid>
          <Container className="page-subheader">
            {community ? (
              <>
                <div className="page-subheader-element">
                  <Image
                    className="community-logo-header"
                    src={community.logo || imagePlaceholderLink}
                    fallbackSrc={imagePlaceholderLink}
                  />
                </div>
                <div className="page-subheader-element">
                  {community.metadata.title || community.uuid}
                </div>
              </>
            ) : (
              <div className="page-subheader-element">
                {i18next.t('Select the community where you want to submit your record.')}
              </div>
            )}
            <div className="community-header-element rel-ml-1">
              {showCommunitySelectionButton && (
                <CommunitySelectionModal
                  onCommunityChange={(community) => {
                    changeSelectedCommunity(community);
                  }}
                  chosenCommunity={community}
                  disableTriggerButton={disableCommunitySelectionButton}
                />
              )}
              {community && 
                <Button
                  basic
                  color="black"
                  size="mini"
                  className="community-header-button ml-5"
                  onClick={() => changeSelectedCommunity(null)}
                  content={i18next.t('Remove')}
                  icon="close"
                  disabled={disableCommunitySelectionButton}
                />
              }
            </div>
          </Container>
        </Container>
      )
    );
  }
}

CommunityHeaderComponent.propTypes = {
  imagePlaceholderLink: PropTypes.string.isRequired,
  community: PropTypes.oneOf([PropTypes.object, null]).isRequired,
  disableCommunitySelectionButton: PropTypes.bool.isRequired,
  showCommunitySelectionButton: PropTypes.bool.isRequired,
  hideCommunityHeader: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  community: state.deposit.editorState.selectedCommunity,
  disableCommunitySelectionButton:
    state.deposit.editorState.ui.disableCommunitySelectionButton,
  showCommunitySelectionButton:
    state.deposit.editorState.ui.showCommunitySelectionButton,
  hideCommunityHeader: state.deposit.editorState.ui.hideCommunityHeader,
});

const mapDispatchToProps = (dispatch) => ({
  changeSelectedCommunity: (community) =>
    dispatch(changeSelectedCommunity(community)),
});

export const CommunityHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityHeaderComponent);
