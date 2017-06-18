const config = require('../config')
const fs = require('fs')
const memo = require('memo-async-lru')
const path = require('path')

const MEMO_OPTS = {
  max: 50 * 1000,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}

const DOCS_PATH = path.join(config.root, 'docs')

function docs (url, cb) {
  console.log('url', url)
  const docPath = path.join(DOCS_PATH, url + '.md')
  fs.readFile(docPath, { encoding: 'utf8' }, cb)
}

const api = {
  docs: memo(docs, MEMO_OPTS)
}

module.exports = api
