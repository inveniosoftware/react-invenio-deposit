import React, { Component } from "react";

import { GroupField, Input } from "react-invenio-forms";
import { Grid } from "semantic-ui-react";

import PropTypes from "prop-types";

export class Imprint extends Component {
  render() {
    const {
      fieldPath, // injected by the custom field loader via the `field` config property
      title,
      publisher,
      place,
      isbn,
      pages,
    } = this.props;
    return (
      <GroupField fieldPath={fieldPath}>
        <Grid>
          <Grid.Column width="8">
            <Input
              fieldPath={`${fieldPath}.publisher`}
              label={publisher.label}
              placeholder={publisher.placeholder}
              description={publisher.description}
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
              fieldPath={`${fieldPath}.isbn`}
              label={isbn.label}
              placeholder={isbn.placeholder}
              description={isbn.description}
            />
          </Grid.Column>
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
              fieldPath={`${fieldPath}.pages`}
              label={pages.label}
              placeholder={pages.placeholder}
              description={pages.description}
            />
          </Grid.Column>
        </Grid>
      </GroupField>
    );
  }
}

Imprint.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  title: PropTypes.object.isRequired,
  publisher: PropTypes.object.isRequired,
  place: PropTypes.object.isRequired,
  isbn: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
};
