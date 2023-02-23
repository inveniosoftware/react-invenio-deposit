import React, { Component } from "react";

import { GroupField, Input } from "react-invenio-forms";
import { Grid } from "semantic-ui-react";

import PropTypes from "prop-types";

export class Journal extends Component {
  render() {
    const {
      fieldPath, // injected by the custom field loader via the `field` config property
      title,
      volume,
      issue,
      pages,
      issn,
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
              fieldPath={`${fieldPath}.volume`}
              label={volume.label}
              placeholder={volume.placeholder}
              description={volume.description}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.issue`}
              label={issue.label}
              placeholder={issue.placeholder}
              description={issue.description}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.pages`}
              label={pages.label}
              placeholder={pages.placeholder}
              description={pages.description}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.issn`}
              label={issn.label}
              placeholder={issn.placeholder}
              description={issn.description}
            />
          </Grid.Column>
        </Grid>
      </GroupField>
    );
  }
}

Journal.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  title: PropTypes.object.isRequired,
  volume: PropTypes.object.isRequired,
  issue: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
  issn: PropTypes.object.isRequired,
};
