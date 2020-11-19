import React from 'react';
import ReactDOM from 'react-dom';

import { Form, Formik } from 'formik';

import { CreatibutorsField } from './CreatibutorsField';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    <Formik>
      {(props) => (
        <Form>
          <CreatibutorsField
            addButtonLabel={"Add creator/contributor"}
            fieldPath={'fieldPath'}
            options={{
              type: [
                { text: "Person", value: "personal" },
                { text: "Organization", value: "organizational" },
              ],
              role: [
                { text: "Editor", value: "editor" },
                { text: "Data Curator", value: "datacurator" },
                { text: "Data Manager", value: "datamanager" },
                { text: "Project Manager", value: "projectmanager" },
              ],
            }}
          />
        </Form>
      )}
    </Formik>,
    div
  );
});
