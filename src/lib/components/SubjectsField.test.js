import { Form, Formik } from 'formik';
import React from 'react';
import ReactDOM from 'react-dom';

import { SubjectsField } from './SubjectsField';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const limitToOptions = [
    {text: 'All', value: 'all'},
    {text: 'MeSH', value: 'mesh'},
  ]
  const options = [
    {
      text: 'Deep Learning',
      value: {
        subject: 'Deep Learning',
        scheme: 'user',
        identifier: 'U1'
      },
    },
    {
      text: 'MeSH: Cognitive Neuroscience',
      value: {
        subject: 'Cognitive Neuroscience',
        scheme: 'mesh',
        identifier: 'D000066494'
      },
    },
  ];

  ReactDOM.render(
    <Formik>
      {(props) => (
        <Form>
          <SubjectsField
            fieldPath={'fieldPath'}
            limitToOptions={limitToOptions}
            options={options}
          />
        </Form>
      )}
    </Formik>,
    div
  );
});
