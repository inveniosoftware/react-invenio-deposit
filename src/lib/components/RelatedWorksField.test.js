import React from "react";
import ReactDOM from "react-dom";

import { Form, Formik } from "formik";

import { RelatedWorksField } from "./RelatedWorksField";

it("renders without crashing", () => {
  const div = document.createElement("div");

  ReactDOM.render(
    <Formik>
      {() => (
        <Form>
          <RelatedWorksField fieldPath="fieldPath" />
        </Form>
      )}
    </Formik>,
    div
  );
});
