#!/usr/bin/env node

import minimist from 'minimist'
import oneLine from 'common-tags/lib/oneLine'
import purifyCss from 'purify-css'
import rimraf from 'rimraf'
import { join, basename, dirname } from 'path'
import { writeFileSync } from 'fs'

import { rootPath, theme, isProd } from '../src/config'

const argv = minimist(process.argv.slice(2), {
  boolean: ['verbose']
})

const outputPath = join(rootPath, './static/bundle.css')

rimraf.sync(outputPath)

const content = [
  './src/views/*.mjs',
  './src/server/*.ejs'
]

const css = [
  './node_modules/tachyons/css/tachyons.min.css',
  './src/server/index.css'
]

const whitelist = [
  // Theme colors
  ...Object.values(theme).map(color => `*${color}*`)
]

const opts = {
  // Selectors to never remove
  whitelist,

  // Minify the CSS
  minify: isProd,

  // Logs stats on how much CSS was removed
  info: argv.debug,

  // Logs which CSS rules were removed
  rejected: argv.debug
}

const startTime = Date.now()

purifyCss(content, css, opts, bundle => {
  // Write file
  writeFileSync(outputPath, bundle)

  if (argv.verbose) {
    const shortOutputPath = join(
      basename(dirname(outputPath)),
      basename(outputPath)
    )
    const buildTime = ((Date.now() - startTime) / 1000).toFixed(2)
    const currentTime = new Date().toLocaleTimeString()

    // Print success message
    console.log(oneLine`
      ${bundle.length} bytes written to ${shortOutputPath}
      (${buildTime} seconds) at ${currentTime}
    `)
  }
})
