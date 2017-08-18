const assert = require('assert')
const fs = require('fs')
const markdownIt = require('markdown-it')
const memo = require('memo-async-lru')
const path = require('path')

const config = require('../config')

const MEMO_OPTS = {
  max: 50 * 1000,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}

// Regular expression to match a path with a directory up component.
const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/

const DOCS_PATH = path.join(config.root, 'docs')

const markdown = markdownIt({
  html: true
})

function doc (opts, cb) {
  assert(opts != null && typeof opts === 'object', '"opts" must be an object')
  assert(typeof opts.url === 'string', '"opts.url" must be a string')

  const { url } = opts
  assert(!UP_PATH_REGEXP.test(url), `Malicious path "${url}" is rejected`)

  const docPath = path.join(DOCS_PATH, url + '.md')
  fs.readFile(docPath, { encoding: 'utf8' }, (err, text) => {
    if (err && err.code === 'ENOENT') {
      err.message = `Doc "${url}" is not found`
      return cb(err)
    }
    const html = markdown.render(text)
    cb(null, html)
  })
}

module.exports = {
  doc: memo(doc, MEMO_OPTS)
}
