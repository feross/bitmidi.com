import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeBuiltins from 'rollup-plugin-node-builtins'
import nodeResolve from 'rollup-plugin-node-resolve'
import { stripIndent } from 'common-tags'

const config = require('./config')
const pkg = require('./package.json')

const DEBUG = !!process.env.DEBUG

module.exports = {
  input: 'src/browser/index.mjs',
  output: {
    banner: stripIndent`
      /*!
       * ${config.title} - ${config.description}
       * Homepage: ${config.httpOrigin}
       * License: Copyright (c) ${pkg.author.name} <${pkg.author.url}>
       */
    `,
    file: DEBUG ? 'static/bundle.js' : undefined,
    format: 'iife',
    name: 'NodeFoo',
    sourcemap: DEBUG ? 'inline' : false
  },
  plugins: [
    nodeResolve({
      // Use the `package.json` "browser" field
      browser: true,
      // Resolve .mjs and .js files
      extensions: ['.mjs', '.js'],
      // Prefer node.js built-ins instead of npm packages
      preferBuiltins: true
    }),
    nodeBuiltins(),
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs()
  ]
}
