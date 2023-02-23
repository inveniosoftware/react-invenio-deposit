import React, { Component } from "react";

import { GroupField, Input } from "react-invenio-forms";
import { Grid } from "semantic-ui-react";

import PropTypes from "prop-types";

export class Meeting extends Component {
  render() {
    const {
      fieldPath, // injected by the custom field loader via the `field` config property
      title,
      acronym,
      dates,
      place,
      url,
      session,
      session_part: sessionPart,
    } = this.props;
    return (
      <GroupField fieldPath={fieldPath}>
        <Grid>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.title`}
              label={title.label}
              placeholder={title.placeholder}
              description={title.description}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.acronym`}
              label={acronym.label}
              placeholder={acronym.placeholder}
              description={acronym.description}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.dates`}
              label={dates.label}
              placeholder={dates.placeholder}
              description={dates.description}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.place`}
              label={place.label}
              placeholder={place.placeholder}
              description={place.description}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.url`}
              label={url.label}
              placeholder={url.placeholder}
              description={url.description}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.session`}
              label={session.label}
              placeholder={session.placeholder}
              description={session.description}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.session_part`}
              label={sessionPart.label}
              placeholder={sessionPart.placeholder}
              description={sessionPart.description}
            />
          </Grid.Column>
        </Grid>
      </GroupField>
    );
  }
}

Meeting.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  title: PropTypes.object.isRequired,
  acronym: PropTypes.object.isRequired,
  session_part: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired,
  dates: PropTypes.object.isRequired,
  place: PropTypes.object.isRequired,
};
