import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeBuiltins from 'rollup-plugin-node-builtins'
import nodeResolve from 'rollup-plugin-node-resolve'

const config = require('./config')
const pkg = require('./package.json')

const DEBUG = !!process.env.DEBUG

module.exports = {
  input: 'src/browser/index.mjs',
  output: {
    file: DEBUG ? 'static/bundle.js' : undefined,
    format: 'iife',
    name: 'NodeFoo'
  },
  sourcemap: DEBUG ? 'inline' : false,
  plugins: [
    nodeResolve({
      // Use the `package.json` "browser" field
      browser: true,
      // Prefer node.js built-ins instead of npm packages
      preferBuiltins: true
    }),
    nodeBuiltins(),
    babel({
      exclude: 'node_modules/**',
      // Disable babel automatically repeatedly inlining babel helper functions
      plugins: ['external-helpers'],
      // Disable rollup-plugin-babel automatically inlining top-level babel helper
      // functions (buggy) and instead keep references to `global.babelHelpers.*`
      externalHelpers: true
    }),
    commonjs()
  ],
  banner: `
    /*!
     * ${config.title} - ${config.description}
     * Homepage: ${config.httpOrigin}
     * Author: ${pkg.author.name} <${pkg.author.url}>
     */
  `
}
