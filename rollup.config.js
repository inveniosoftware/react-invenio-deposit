// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import localResolve from "rollup-plugin-local-resolve";
import path from "path";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import pkg from "./package.json";

export default {
  input: "src/lib/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
      exports: "named",
      strict: false,
    },
    {
      file: pkg.module,
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      entries: {
        "@translations/i18next": path.resolve(__dirname, "src/lib/i18next"),
      },
    }),
    peerDepsExternal(),
    postcss({
      plugins: [],
      minimize: true,
      sourceMap: "inline",
    }),
    localResolve(),
    resolve(),
    babel({
      presets: ["react-app"],
      babelHelpers: "runtime",
      exclude: "node_modules/**",
    }),
    commonjs(),
    json(),
  ],
};
