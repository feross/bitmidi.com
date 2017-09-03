const assert = require('assert')
const parallel = require('run-parallel')
const path = require('path')
const sqlite3 = require('sqlite3')

const config = require('../../config')
const highlight = require('../highlight')
const twitter = require('./twitter')

// Enable verbose SQLite logs (disabled in production)
if (!config.isProd) sqlite3.verbose()

const db = new sqlite3.Database(path.join(config.root, 'db', 'snippets'))

init()

function init () {
  const sql = `
    CREATE TABLE IF NOT EXISTS snippets(
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      code_html TEXT NOT NULL,
      author TEXT NOT NULL
    );
  `
  db.run(sql)
}

function add (snippet, cb) {
  assert(
    snippet != null && typeof snippet === 'object',
    'Snippet must be an object'
  )
  assert(
    typeof snippet.name === 'string',
    'Snippet name must be a string'
  )
  assert(
    snippet.name.length > 0,
    'Snippet name must not be empty'
  )
  assert(
    typeof snippet.code === 'string',
    'Code must be a string'
  )
  assert(
    snippet.code.length > 0,
    'Code must not be empty'
  )
  assert(
    typeof snippet.author === 'string',
    'Author must be a string'
  )
  assert(
    snippet.author.length > 0,
    'Author must not be empty'
  )

  const sql = `
    INSERT INTO snippets (name, code, code_html, author)
    VALUES ($name, $code, $code_html, $author)
  `

  const codeHtml = highlight(snippet.code, 'js')

  db.run(sql, {
    $name: snippet.name,
    $code: snippet.code,
    $code_html: codeHtml,
    $author: snippet.author
  }, cb)
}

function get (opts, cb) {
  assert(
    opts != null && typeof opts === 'object',
    'Opts must be an object'
  )
  assert(
    typeof opts.id === 'string',
    'Snippet id must be a string'
  )
  assert(
    opts.id.length > 0,
    'Snippet id must not be empty'
  )

  const sql = 'SELECT * FROM snippets WHERE id = $id'
  db.get(sql, { $id: opts.id }, (err, snippet) => {
    if (err) return cb(err)
    if (snippet == null) return cb(new Error('No snippet with that id'))
    populateSnippet(snippet, cb)
  })
}

function all (opts, cb) {
  const sql = 'SELECT * FROM snippets'
  db.all(sql, (err, snippets) => {
    if (err) return cb(err)
    parallel(snippets.map(snippet => cb => populateSnippet(snippet, cb)), cb)
  })
}

function populateSnippet (snippet, cb) {
  twitter.getUser({ screen_name: snippet.author }, (err, user) => {
    if (err) return cb(err)
    snippet.author_image = user.profile_image_url_https
    snippet.author_url = `https://twitter.com/${snippet.author}`
    cb(null, snippet)
  })
}

module.exports = {
  add,
  get,
  all
}
