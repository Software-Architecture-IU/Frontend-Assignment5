import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import { rollupPluginHTML as html } from "@web/rollup-plugin-html";
import clean from "@rollup-extras/plugin-clean";

const bundle = [
  {
    input: "src/main.ts",
    output: { file: "dist/bundle.js" },
    external: ["./index.html", "main.css"],
    plugins: [
      typescript(),
      nodeResolve({ browser: true }),
      commonjs(),
      terser(),
    ],
  },
  {
    input: "main.css",
    output: [{ file: "dist/main.css" }],
    plugins: [
      postcss({
        minimize: true,
      }),
    ],
  },
  {
    input: "index.html",
    output: { dir: "dist" },
    plugins: [
      html(),
      clean({
        targets: [
          "dist/bundle.js",
          "dist/main.css",
          "dist/rollup-plugin-html-noop.js",
        ],
      }),
    ],
  },
];
export default bundle;
