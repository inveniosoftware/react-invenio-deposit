import React from 'react';
import ReactDOM from 'react-dom';

import { Form, Formik } from 'formik';

import { FundingField } from './FundingField';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const options = {
    funder: [
      {
        name: 'Funder 1',
        identifier: 'funder1',
        scheme: 'funderScheme1',
      },
      {
        name: 'Funder 2',
        identifier: 'funder2',
        scheme: 'funderScheme2',
      },
    ],
    award: [
      {
        title: 'Award A',
        number: '1234confusing_name_because_not_always_number',
        identifier: 'awardA',
        scheme: 'awardSchemeA',
        parentScheme: 'funderScheme1',
        parentIdentifier: 'funder1',
      },
      {
        title: 'Award B1',
        number: 'B11234',
        identifier: 'awardB1',
        scheme: 'awardSchemeB',
        parentScheme: 'funderScheme2',
        parentIdentifier: 'funder2',
      },
      {
        title: 'Award B2',
        number: 'B21234',
        identifier: 'awardB2',
        scheme: 'awardSchemeB',
        parentScheme: 'funderScheme2',
        parentIdentifier: 'funder2',
      },
    ],
  };

  ReactDOM.render(
    <Formik>
      {(props) => (
        <Form>
          <FundingField fieldPath={'fieldPath'} options={options} />
        </Form>
      )}
    </Formik>,
    div
  );
});
