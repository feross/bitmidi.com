#!/usr/bin/env node

import path from 'path'
import purifyCss from 'purify-css'
import rimraf from 'rimraf'

import config from '../config'

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
  minify: config.isProd,

  // Logs stats on how much CSS was removed
  info: DEBUG,

  // Logs which CSS rules were removed
  rejected: false
}

rimraf.sync(outputPath)

purifyCss(content, css, opts)
