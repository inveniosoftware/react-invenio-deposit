import React from 'react';
import ReactDOM from 'react-dom';

import { Form, Formik } from 'formik';

import { ResourceTypeField } from './ResourceTypeField';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const options = {
    type: [
      {
        icon: '',
        text: 'type Text 1',
        value: 'typeValue1',
      },
      {
        icon: 'frown outline',
        text: 'type Text 2',
        value: 'typeValue2',
      }
    ],
    subtype: [
      {
        'parent-text': 'type Text 2',
        'parent-value': 'typeValue2',
        text: 'subtype Text',
        value: 'subtypeValue',
      }
    ]
  }

  ReactDOM.render(
    <Formik>
      {(props) => (
        <Form>
          <ResourceTypeField
            fieldPath={'fieldPath'}
            options={options}
          />
        </Form>
      )}
    </Formik>,
    div
  );
});
