// This file is part of InvenioRDM
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import { useFormikContext } from 'formik';
import { Container, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { i18next } from '@translations/i18next';
import { Image } from 'react-invenio-forms';
import { CommunitySelectionModal } from '../CommunitySelectionModal';

export const CommunityHeaderComponent = ({
  community,
  imagePlaceholderLink,
  setCommunity,
}) => {
  const communityLogo = community?.links?.logo
    ? community.links.logo
    : imagePlaceholderLink;
  const communityTitle = community?.metadata?.title
    ? community.metadata.title
    : community;

  const { values: formikDraft } = useFormikContext();

  return (
    <Container className="deposits-community-header" fluid>
      <Container className="community-header">
        {community ? (
          <Image
            className="community-logo-header"
            src={communityLogo}
            fallbackSrc={imagePlaceholderLink}
          />
        ) : (
          <span>{i18next.t('No community selected.')}</span>
        )}

        <div className="community-header-info">
          {communityTitle}
          <CommunitySelectionModal
            onCommunityChange={(community) => {
              setCommunity(community, formikDraft);
            }}
            chosenCommunity={community}
            trigger={
              <Button
                size="mini"
                className="community-header-button ml-5"
                color="blue"
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
};

CommunityHeaderComponent.propTypes = {
  imagePlaceholderLink: PropTypes.string.isRequired,
  community: PropTypes.object.isRequired,
  setCommunity: PropTypes.func.isRequired,
};
