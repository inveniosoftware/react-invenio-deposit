// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

// TODO: Move to rely on DepositRecordSerializer with the deserializedDefault
//       values to generate the empty values. Then delete this file.

export const emptyIdentifier = {
  scheme: "",
  identifier: "",
};

export const emptyAffiliation = {
  name: "",
  identifiers: [emptyIdentifier],
};

export const emptyAdditionalTitle = {
  lang: "",
  title: "",
  type: "alternative-title",
};

export const emptyAdditionalDescription = {
  lang: "",
  description: "",
  type: "",
};

export const emptyRelatedWork = {
  scheme: "",
  identifier: "",
  resource_type: "",
  relation_type: "",
};

export const emptyDate = {
  date: "",
  description: "",
  type: "",
};

export const emptyFunding = {
  funder: {
    name: "",
  },
  award: {
    title: "",
    number: "",
  },
};
