module.exports = {
  add,
  vote,
  get,
  all,
  search
}

const assert = require('assert')
const debug = require('debug')('bitmidi:api:snippet')
const parallel = require('run-parallel')
const path = require('path')
const sqlite3 = require('sqlite3')

const config = require('../../config')
const highlight = require('../highlight')
const slug = require('../lib/slug')
const twitter = require('./twitter')

const DB_PATH = path.join(config.rootPath, 'db', 'snippets')

// Enable verbose SQLite logs (disabled in production)
if (!config.isProd) sqlite3.verbose()

const db = new sqlite3.Database(DB_PATH)

init()

function init () {
  debug('init')
  const sqls = [
    `
      CREATE TABLE IF NOT EXISTS snippets(
        rowid INTEGER PRIMARY KEY NOT NULL,
        id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        html TEXT NOT NULL,
        author TEXT NOT NULL,
        voters TEXT NOT NULL DEFAULT '[]',
        votes INTEGER NOT NULL DEFAULT 0
      )
    `,
    `
      CREATE VIRTUAL TABLE IF NOT EXISTS snippets_search USING fts4(
        content='snippets',
        id,
        name
      )
    `,
    `
      CREATE TRIGGER IF NOT EXISTS snippets_bu BEFORE UPDATE ON snippets BEGIN
        DELETE FROM snippets_search WHERE docid=OLD.rowid;
      END
    `,
    `
      CREATE TRIGGER IF NOT EXISTS snippets_bd BEFORE DELETE ON snippets BEGIN
        DELETE FROM snippets_search WHERE docid=OLD.rowid;
      END
    `,
    `
      CREATE TRIGGER IF NOT EXISTS snippets_au AFTER UPDATE ON snippets BEGIN
        INSERT INTO snippets_search(docid, id, name)
        VALUES(NEW.rowid, NEW.id, NEW.name);
      END
    `,
    `
      CREATE TRIGGER IF NOT EXISTS snippets_ai AFTER INSERT ON snippets BEGIN
        INSERT INTO snippets_search(docid, id, name)
        VALUES(NEW.rowid, NEW.id, NEW.name);
      END
    `,
    `
      INSERT INTO snippets_search(snippets_search) VALUES('optimize')
    `
  ]

  db.serialize(() => {
    sqls.map((sql) => db.run(sql))
  })
}

function add (snippet, cb) {
  debug('add %o', snippet)
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
    'Snippet code must be a string'
  )
  assert(
    snippet.code.length > 0,
    'Snippet code must not be empty'
  )
  assert(
    typeof snippet.author === 'string',
    'Snippet author must be a string'
  )
  assert(
    snippet.author.length > 0,
    'Snippet author must not be empty'
  )

  const sql = `
    INSERT INTO snippets (id, name, code, html, author, voters, votes)
    VALUES ($id, $name, $code, $html, $author, $voters, $votes)
  `

  const idBase = slug(snippet.name)
  const codeHtml = highlight(snippet.code, 'js')

  tryInsert(1)

  function tryInsert (num) {
    const id = idBase + (num === 1 ? '' : `-${num}`)
    db.run(sql, {
      $id: id,
      $name: snippet.name,
      $code: snippet.code,
      $html: codeHtml,
      $author: snippet.author,
      $voters: JSON.stringify([snippet.author]),
      $votes: 1
    }, (err) => {
      if (err && err.code === 'SQLITE_CONSTRAINT') {
        // Snippet id is already taken
        tryInsert(num + 1)
        return
      }
      cb(err)
    })
  }
}

function vote (opts, cb) {
  debug('vote %o', opts)
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
  assert(
    typeof opts.voter === 'string',
    'Voter must be a string'
  )
  assert(
    opts.voter.length > 0,
    'Voter must not be empty'
  )

  const sql = 'SELECT * FROM snippets WHERE id = $id'
  db.get(sql, { $id: opts.id }, (err, snippet) => {
    if (err) return cb(err)
    if (snippet == null) return cb(new Error('No snippet found'))

    try {
      snippet.voters = JSON.parse(snippet.voters)
    } catch (err) {
      return cb(err)
    }
    snippet.voters.push(opts.voter)
    snippet.voters = Array.from(new Set(snippet.voters))

    snippet.votes = snippet.voters.length
    snippet.voters = JSON.stringify(snippet.voters)

    const sql = `
      UPDATE snippets
      SET voters = $voters, votes = $votes
      WHERE id = $id
    `

    db.run(sql, {
      $voters: snippet.voters,
      $votes: snippet.votes,
      $id: snippet.id
    }, (err) => {
      if (err) return cb(err)
      populateSnippet(snippet, cb)
    })
  })
}

function get (opts, cb) {
  debug('get %o', opts)
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
    if (snippet == null) return cb(new Error('No snippet found'))
    populateSnippet(snippet, cb)
  })
}

function all (opts, cb) {
  debug('all %o', opts)
  const sql = 'SELECT * FROM snippets ORDER BY votes DESC'
  db.all(sql, (err, snippets) => {
    if (err) return cb(err)
    parallel(snippets.map(snippet => cb => populateSnippet(snippet, cb)), cb)
  })
}

function search (opts, cb) {
  debug('search %o', opts)
  assert(
    opts != null && typeof opts === 'object',
    'Opts must be an object'
  )
  assert(
    typeof opts.q === 'string',
    'Search query must be a string'
  )
  const sql = 'SELECT * FROM snippets_search WHERE name MATCH $q'
  db.all(sql, { $q: opts.q }, (err, results) => {
    if (err) return cb(err)

    parallel(results.map(result => cb => {
      get({ id: result.id }, cb)
    }), (err, snippets) => {
      if (err) return cb(err)
      cb(null, {
        q: opts.q,
        snippets
      })
    })
  })
}

function populateSnippet (snippet, cb) {
  twitter.getUser({ screen_name: snippet.author }, (err, user) => {
    if (err) return cb(err)
    snippet.author_image = user.profile_image_url_https
    snippet.author_url = `https://twitter.com/${snippet.author}`
    snippet.url = `${config.httpOrigin}/${snippet.id}`

    // TODO: Do not send full voter list
    delete snippet.voters

    cb(null, snippet)
  })
}
