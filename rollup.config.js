const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeResolve = require('rollup-plugin-node-resolve')

const config = require('./config')
const pkg = require('./package.json')

const DEBUG = !!process.env.DEBUG

module.exports = {
  input: 'src/browser/index.js',
  output: {
    file: DEBUG ? 'static/bundle.js' : undefined,
    format: 'iife',
    name: 'NodeFoo'
  },
  sourcemap: DEBUG ? 'inline' : false,
  plugins: [
    nodeResolve({
      browser: true, // use package.json browser field
      preferBuiltins: true // prefer node.js built-ins instead of npm packages
    }),
    nodeBuiltins(),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'], // do not repeatedly inline babel helpers
      externalHelpers: true // instead, babel will reference `global.babelHelpers`
    }),
    commonjs()
  ],
  banner: `
    /*!
     * ${config.name} - ${config.description}
     * Homepage: ${config.httpOrigin}
     * Author: ${pkg.author.name} <${pkg.author.url}>
     */
  `
}
