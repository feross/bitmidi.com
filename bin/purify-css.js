#!/usr/bin/env node

const debug = require('debug')('nodefoo:purify-css')
const path = require('path')
const purify = require('purify-css')
const rimraf = require('rimraf')

const config = require('../config')

const outputPath = path.join(config.root, './static/style.css')

const content = [
  './src/views/*.js',
  './src/server/index.ejs'
]

const css = [
  './node_modules/tachyons/css/tachyons.min.css',
  './node_modules/highlight.js/styles/monokai-sublime.css',
  './node_modules/codemirror/lib/codemirror.css',
  './node_modules/codemirror/theme/monokai.css',
  './src/server/style.css'
]

const whitelist = [
  // Highlight.js
  '*hljs*',

  // CodeMirror
  'CodeMirror',
  '*CodeMirror*',
  'pre',
  '*cm*',

  // HACK: Classes with capital letters do not work
  // See: https://github.com/purifycss/purifycss/issues/145
  'CodeMirror-lines',
  'CodeMirror-scrollbar-filler',
  'CodeMirror-gutter-filler',
  'CodeMirror-gutters',
  'CodeMirror-linenumbers',
  'CodeMirror-linenumber',
  'CodeMirror-guttermarker',
  'CodeMirror-guttermarker-subtle',
  'CodeMirror-cursor',
  'CodeMirror-secondarycursor',
  'CodeMirror-overwrite',
  'CodeMirror-cursor',
  'CodeMirror-rulers',
  'CodeMirror-ruler',
  'CodeMirror-composing',
  'CodeMirror-matchingbracket',
  'CodeMirror-nonmatchingbracket',
  'CodeMirror-matchingtag',
  'CodeMirror-activeline-background',
  'CodeMirror-sizer',
  'CodeMirror-vscrollbar',
  'CodeMirror-hscrollbar',
  'CodeMirror-scrollbar-filler',
  'CodeMirror-gutter-filler',
  'CodeMirror-vscrollbar',
  'CodeMirror-hscrollbar',
  'CodeMirror-scrollbar-filler',
  'CodeMirror-gutter-filler',
  'CodeMirror-gutters',
  'CodeMirror-gutter',
  'CodeMirror-gutter-wrapper',
  'CodeMirror-gutter-background',
  'CodeMirror-gutter-elt',
  'CodeMirror-gutter-wrapper',
  'CodeMirror-gutter-wrapper',
  'CodeMirror-lines',
  'CodeMirror-wrap',
  'CodeMirror-linebackground',
  'CodeMirror-linewidget',
  'CodeMirror-widget',
  'CodeMirror-rtl',
  'CodeMirror-sizer',
  'CodeMirror-gutter',
  'CodeMirror-gutters',
  'CodeMirror-linenumber',
  'CodeMirror-measure',
  'CodeMirror-cursor',
  'CodeMirror-measure',
  'CodeMirror-cursors',
  'CodeMirror-dragcursors',
  'CodeMirror-focused',
  'CodeMirror-cursors',
  'CodeMirror-selected',
  'CodeMirror-focused',
  'CodeMirror-selected',
  'CodeMirror-crosshair',
  'CodeMirror-cursors',
  'CodeMirror-selectedtext',

  // Theme colors
  ...Object.values(config.theme).map(color => `*${color}*`)
]

const opts = {
  output: outputPath,

  // Selectors to never remove
  whitelist,

  // Minify the CSS
  minify: !debug.enabled,

  // Logs stats on how much CSS was removed
  info: true,

  // Logs which CSS rules were removed
  rejected: debug.enabled

}

rimraf.sync(outputPath)

purify(content, css, opts)
