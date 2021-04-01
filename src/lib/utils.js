// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.


export function toCapitalCase(str) {
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * Traverse the leaves (non-Object, non-Array values) of obj and execute func
 * on each.
 *
 * @param {object} obj - generic Object
 * @param {function} func - (leaf) => ... (identity by default)
 *
 */
export function leafTraverse(obj, func = (l) => l) {
  if (typeof obj === "object") {  // Objects and Arrays
    for (const key in obj) {
      leafTraverse(obj[key], func);
    }
  } else {
    func(obj);
  }
}
