#!/usr/bin/env node

import minimist from 'minimist'
import oneLine from 'common-tags/lib/oneLine'
import PurgeCss from 'purgecss'
import rimraf from 'rimraf'
import { join, basename, dirname } from 'path'
import { writeFileSync } from 'fs'

import { rootPath, theme } from '../src/config'

const startTime = Date.now()

const argv = minimist(process.argv.slice(2), {
  boolean: ['debug', 'verbose']
})

const outputPath = join(rootPath, './static/bundle.css')

rimraf.sync(outputPath)

// CSS files to concat, purge, and minify
const css = [
  './node_modules/tachyons/css/tachyons.min.css',
  './src/server/index.css'
]

// Files to search for selectors within
const content = [
  './src/views/*.mjs',
  './src/server/*.ejs'
]

// Selectors to never remove
const whitelistPatternsChildren = [
  // Theme colors
  ...Object.values(theme).map(color => new RegExp(`.*?${color}.*?`))
]

const purgeCss = new PurgeCss({
  css,
  content,
  whitelistPatternsChildren,
  keyframes: true,
  rejected: argv.debug
})

const files = purgeCss.purge()

const bundle = files.reduce((acc, file) => {
  return acc + file.css
}, '')

// Write file
writeFileSync(outputPath, bundle)

if (argv.debug) {
  files.forEach(file => {
    console.log(`Removed from ${file.file}:`)
    file.rejected.forEach(rejectedDecl => console.log(`  ${rejectedDecl}`))
  })
}

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
