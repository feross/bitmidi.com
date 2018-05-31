#!/usr/bin/env node

const path = require('path')
const purifyCss = require('purify-css')
const rimraf = require('rimraf')

const config = require('../config')

const DEBUG = !!process.env.DEBUG

const outputPath = path.join(config.rootPath, './static/bundle.css')

const content = [
  './src/views/*.js',
  './src/index.ejs'
]

const css = [
  './node_modules/tachyons/css/tachyons.min.css',
  './src/server/index.css'
]

const whitelist = [
  // Theme colors
  ...Object.values(config.theme).map(color => `*${color}*`)
]

const opts = {
  output: outputPath,

  // Selectors to never remove
  whitelist,

  // Minify the CSS
  minify: !DEBUG,

  // Logs stats on how much CSS was removed
  info: false,

  // Logs which CSS rules were removed
  rejected: false
}

rimraf.sync(outputPath)

purifyCss(content, css, opts)
