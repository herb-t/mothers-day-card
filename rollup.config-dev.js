const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const eslint = require('rollup-plugin-eslint');
const noderesolve = require('rollup-plugin-node-resolve');

module.exports = {
  context: 'window',
  format: 'iife',
  entry: 'src/index.js',
  dest: 'out/index.js',

  sourceMap: 'inline',
  useStrict: true,
  exports: 'none',
  indent: false,

  external: [],

  globals: {},

  plugins: [
    // lint first
    eslint({ throwError: true }),

    // best-effort translation from CJS module format to ES6 module format
    commonjs(),

    // resolve module paths using the node_modules folder
    noderesolve({ jsnext: true, browser: true }),

    babel({ runtimeHelpers: true, exclude: 'node_modules/**' })
  ]
};
