// This file is part of InvenioRDM
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { Container, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { i18next } from '@translations/i18next';
import { Image } from 'react-invenio-forms';

class CommunityHeaderButton extends React.Component {
  render() {
    return (
      <Button
        size="mini"
        className="community-header-button ml-5"
        color="blue"
        onClick={() => console.log('TODO: Open community modal')}
        name="setting"
      >
        {i18next.t('Edit')}
      </Button>
    );
  }
}

class CommunityHeaderInfo extends React.Component {
  render() {
    const { community, imagePlaceholderLink } = this.props;
    return (
      <Container className="community-header">
        <Image
          className="community-logo-header"
          src={community.links.logo}
          fallbackSrc={imagePlaceholderLink}
        />
        <div className="community-header-info">
          {community.metadata.title}
          <CommunityHeaderButton />
        </div>
      </Container>
    );
  }
}

CommunityHeaderInfo.propTypes = {
  imagePlaceholderLink: PropTypes.string.isRequired,
  community: PropTypes.object,
};

CommunityHeaderInfo.defaultProps = {
  community: undefined,
};

class EmptyCommunity extends React.Component {
  render() {
    return (
      <Container className="community-header">
        <div className="community-header-info">
          <span>{i18next.t('No community selected.')}</span>
          <CommunityHeaderButton />
        </div>
      </Container>
    );
  }
}

export class CommunityHeaderComponent extends React.Component {
  componentDidMount() {
    const { community, setCommunity } = this.props;
    setCommunity(community);
  }

  render() {
    const { communityRedux, imagePlaceholderLink } = this.props;
    return (
      <Container className="deposits-community-header" fluid>
        {communityRedux ? (
          <CommunityHeaderInfo
            community={communityRedux}
            imagePlaceholderLink={imagePlaceholderLink}
          />
        ) : (
          <EmptyCommunity />
        )}
      </Container>
    );
  }
}

CommunityHeaderComponent.propTypes = {
  imagePlaceholderLink: PropTypes.string.isRequired,
  community: PropTypes.object.isRequired,
  setCommunity: PropTypes.func.isRequired,
  communityRedux: PropTypes.object,
};

CommunityHeaderComponent.defaultProps = {
  communityRedux: undefined,
};
