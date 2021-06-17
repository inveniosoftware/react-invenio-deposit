// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

const { readFileSync, writeFileSync } = require('fs');
const { gettextToI18next } = require('i18next-conv');
const { languages } = require('./package').config;

// it accepts the same options as the cli.
// https://github.com/i18next/i18next-gettext-converter#options
const options = {/* you options here */}

function save(target) {
    return result => {
      writeFileSync(target, result);
    };
  }

for (lang of languages) {
gettextToI18next(lang, readFileSync(`src/lib/translations/${lang}/messages.po`), options)
.then(save(`src/lib/translations/${lang}/translations.json`));
}
