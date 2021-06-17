// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

const fs = require('fs');
const chalk = require('chalk');
const { languages } = require('./package').config;

// list of func used to 
// mark the strings for translation
const funcList = ['i18next.t', 'i18n.t', 't'];

module.exports = {
    options: {
        debug: true,
        browserLanguageDetection: true,
        func: {
            list: funcList,
            extensions: ['.js', '.jsx']
        },
        trans: false, // Enable for using Trans component
        lngs: languages,
        ns: [
            // file name (.json)
            'translations',
        ],
        defaultLng: 'en',
        defaultNs: 'translations',
        resource: {
            // The path where resources get loaded from. Relative to current working directory. 
            loadPath: 'src/lib/translations/{{lng}}/{{ns}}.json',

            // The path to store resources.
            savePath: 'src/lib/translations/{{lng}}/{{ns}}.json',

            jsonIndent: 2,
            lineEnding: '\n'
        },
        nsSeparator: false, // namespace separator

        //Set to false to disable key separator
        // if you prefer having keys as the fallback for translation (e.g. gettext). 
        keySeparator: false,
    },

    // func is provided
    // (if needed)for more custom extractions.
    transform: function customTransform(file, enc, done) {
        "use strict";
        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);
        let count = 0;

        parser.parseFuncFromString(content, { list: funcList }, (key, options) => {
            parser.set(key, Object.assign({}, options, {
                nsSeparator: false,
                keySeparator: false
            }));
            ++count;
        });

        if (count > 0) {
            console.log(`i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(JSON.stringify(file.relative))}`);
        }
        done();
    }
};
