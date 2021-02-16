import { Form, Formik } from 'formik';
import React from 'react';
import ReactDOM from 'react-dom';

import { SubjectsField } from './SubjectsField';

// TODO: Re-enable when SubjectsField is supported
it.skip('renders without crashing', () => {
  const div = document.createElement('div');
  const limitToOptions = [
    {text: 'All', value: 'all'},
    {text: 'MeSH', value: 'mesh'},
  ]
  const options = [
    { title: 'Deep Learning', id: 'dl', scheme: 'user' },
    { title: 'MeSH: Cognitive Neuroscience', id: 'cn',  scheme: 'mesh' },
    { title: 'FAST: Glucagonoma', id: 'gl', scheme: 'fast' },
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
