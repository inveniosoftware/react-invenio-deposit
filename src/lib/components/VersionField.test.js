import React from 'react';
import ReactDOM from 'react-dom';

import { Form, Formik } from 'formik';

import { VersionField } from './VersionField';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    <Formik>
      {(props) => (
        <Form>
          <VersionField fieldPath={'fieldPath'} />
        </Form>
      )}
    </Formik>,
    div
  );
});
