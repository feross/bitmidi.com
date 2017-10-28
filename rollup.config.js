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
