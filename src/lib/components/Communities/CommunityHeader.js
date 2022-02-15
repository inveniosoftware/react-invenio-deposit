// This file is part of InvenioRDM
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { Container, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class CommunityHeaderButton extends React.Component {
  render() {
    return (
      <Button
        size="mini"
        className="ml-5"
        color="blue"
        onClick={() => console.log('TODO: Open community modal')}
        name="setting"
      >
        Edit
      </Button>
    );
  }
}

class CommunityHeaderInfo extends React.Component {
  render() {
    const { community, imagePlaceholderLink } = this.props;
    const logoLink = community ? community?.links?.logo : imagePlaceholderLink;
    return (
      <Container className="community-header">
        <Image size="mini" src={logoLink} /> {community?.metadata?.title}
        <CommunityHeaderButton />
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
      <Container className="community-header empty">
        <span>No community selected.</span>
        <CommunityHeaderButton />
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
