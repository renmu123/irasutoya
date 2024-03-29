import path from "path";
import { fileURLToPath } from "url";

import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import { del } from "@kineticcafe/rollup-plugin-delete";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const deleteDistTypes = () =>
  del({
    targets: path.resolve(__dirname, "dist/types"),
    hook: "writeBundle",
  });

export default [
  {
    input: "src/core/index.ts",
    output: [
      {
        file: "dist/index.mjs",
        format: "es",
        exports: "named",
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
      },
    ],
    plugins: [
      typescript(),
      nodeResolve({ browser: false }),
      commonjs(),
      json(),
    ],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "index.js",
        format: "es",
      },
    ],
    plugins: [
      typescript(),
      nodeResolve({ browser: false }),
      commonjs(),
      json(),
    ],
  },
  {
    input: "dist/types/index.d.ts",
    plugins: [
      dts({
        respectExternal: true,
        compilerOptions: {
          baseUrl: ".",
          paths: {
            "~/*": ["src/*"],
          },
        },
      }),
      deleteDistTypes(),
    ],
    output: [
      {
        format: "es",
        file: "dist/index.d.ts",
      },
    ],
  },
];
