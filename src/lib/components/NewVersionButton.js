// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { useState } from 'react';
import axios from 'axios';
import { Icon, Button, Popup } from 'semantic-ui-react';

export const NewVersionButton = (props) => {
  const [loading, setLoading] = useState(false);
  const handleError = props.onError;
  const handleClick = () => {
    setLoading(true);
    axios
      .post(props.record.links.versions)
      .then((response) => {
        window.location = response.data.links.self_html;
      })
      .catch((error) => {
        setLoading(false);
        handleError(error.response.data.message);
      });
  };

  return (
    <Popup
      content="You don't have permissions to create a new version."
      disabled={!props.disabled}
      trigger={
        <div style={{ display: 'inline-block', ...props.style }}>
          <Button
            disabled={props.disabled}
            type="button"
            color="green"
            size="mini"
            onClick={handleClick}
            loading={loading}
          >
            <Icon name="tag" />
            New version
          </Button>
        </div>
      }
    />
  );
};
