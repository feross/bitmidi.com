const assert = require('assert')
const config = require('../config')
const fs = require('fs')
const memo = require('memo-async-lru')
const path = require('path')

const MEMO_OPTS = {
  max: 50 * 1000,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}

const DOCS_PATH = path.join(config.root, 'docs')

function doc (opts, cb) {
  assert(typeof opts.url, 'string')

  const docPath = path.join(DOCS_PATH, opts.url + '.md')
  fs.readFile(docPath, { encoding: 'utf8' }, cb)
}

const api = {
  doc: memo(doc, MEMO_OPTS)
}

module.exports = api
