const assert = require('assert')
const path = require('path')
const sqlite3 = require('sqlite3')

const config = require('../config')

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
      author TEXT NOT NULL
    );
  `
  db.run(sql)
}

function add (snippet, cb) {
  assert(
    snippet != null && typeof snippet === 'object',
    '"snippet" must be an obejct'
  )
  assert(
    typeof snippet.name === 'string',
    '"snippet.name" must be a string'
  )
  assert(
    typeof snippet.code === 'string',
    '"snippet.code" must be a string'
  )
  assert(
    typeof snippet.author === 'string',
    '"snippet.author" must be a string'
  )

  const sql = `
    INSERT INTO snippets (name, code, author)
    VALUES ($name, $code, $author)
  `

  db.run(sql, {
    $name: snippet.name,
    $code: snippet.code,
    $author: snippet.author
  }, cb)
}

function get (opts, cb) {
  assert(
    opts != null && typeof opts === 'object',
    '"opts" must be an object'
  )
  assert(
    typeof opts.id === 'string',
    '"opts.id" must be a string'
  )

  const sql = 'SELECT * FROM snippets WHERE id = $id'
  db.get(sql, { $id: opts.id }, cb)
}

function all (opts, cb) {
  const sql = 'SELECT * FROM snippets'
  db.all(sql, cb)
}

module.exports = {
  add,
  get,
  all
}
