import React from 'react';
import ReactDOM from 'react-dom';

import { Form, Formik } from 'formik';

import { PublicationDateField } from './PublicationDateField';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    <Formik>
      {(props) => (
        <Form>
          <PublicationDateField fieldPath={'fieldPath'} />
        </Form>
      )}
    </Formik>,
    div
  );
});
