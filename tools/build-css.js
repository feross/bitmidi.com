#!/usr/bin/env node

import cssnano from 'cssnano'
import minimist from 'minimist'
import oneLine from 'common-tags/lib/oneLine'
import postcss from 'postcss'
import PurgeCss from 'purgecss'
import rimraf from 'rimraf'
import { join, basename, dirname } from 'path'
import { writeFileSync } from 'fs'

import { rootPath, theme } from '../src/config'

const outputPath = join(rootPath, './static/bundle.css')

const shortOutputPath = join(
  basename(dirname(outputPath)),
  basename(outputPath)
)

const argv = minimist(process.argv.slice(2), {
  boolean: ['debug', 'verbose']
})

run()

async function run () {
  const startTime = Date.now()

  // Remove existing output CSS file
  rimraf.sync(outputPath)

  // CSS files to purge, concat, and minify
  const css = [
    './node_modules/tachyons/css/tachyons.min.css',
    './src/css/*.css'
  ]

  const files = await purge(css)

  // Concat all CSS files
  let bundle = files.reduce((acc, file) => {
    return acc + file.css
  }, '')

  bundle = await minify(bundle)

  // Write file
  writeFileSync(outputPath, bundle)

  // Print success message
  if (argv.verbose) {
    const buildTime = ((Date.now() - startTime) / 1000).toFixed(2)
    const currentTime = new Date().toLocaleTimeString()

    console.log(oneLine`
      ${bundle.length} bytes written to ${shortOutputPath}
      (${buildTime} seconds) at ${currentTime}
    `)
  }
}

/**
 * Removes unused CSS declarations from CSS files
 */
async function purge (css) {
  // Files to search for used selectors. Used selectors will not be purged.
  const content = [
    './src/views/*.js',
    './src/server/*.ejs'
  ]

  // Whitelist of selectors to never purge
  const whitelistPatternsChildren = [
    // Theme colors
    ...Object.values(theme).map(color => new RegExp(color))
  ]

  const files = await new PurgeCss().purge({
    css,
    content,
    whitelistPatternsChildren,
    keyframes: true,
    variables: true,
    rejected: argv.debug
  })

  // Print removed CSS selectors
  if (argv.debug) {
    files.forEach(file => {
      console.log(`Removed from ${file.file}:`)
      file.rejected.forEach(rejectedDecl => console.log(`  ${rejectedDecl}`))
    })
  }

  return files
}

async function minify (css) {
  const result = await postcss([
    cssnano({
      preset: ['advanced', {
        discardComments: { removeAll: true }
      }]
    })
  ]).process(css, { from: css[0], to: outputPath })
  return result.css
}
