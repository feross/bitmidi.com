#!/usr/bin/env node

const assert = require('assert')
const debug = require('debug')('nodefoo:generate')
const fs = require('fs')
const gitPull = require('git-pull-or-clone')
const mkdirp = require('mkdirp')
const path = require('path')
const pathExists = require('path-exists')
const rimraf = require('rimraf')

const config = require('../config')

const BIN_PATH = path.join(config.root, 'bin')
const REPO_PATH = path.join(config.root, 'tmp', 'node')
const REPO_API_PATH = path.join(REPO_PATH, 'doc', 'api')
const OUT_PATH = path.join(config.root, 'docs')

rimraf.sync(OUT_PATH)

pull()

function pull () {
  gitPull('git@github.com:nodejs/node.git', REPO_PATH, (err) => {
    if (err) throw err
    debug('fetched nodejs/node repo')
    getModNames()
  })
}

function getModNames () {
  const entries = fs.readdirSync(REPO_API_PATH)

  const modNames = entries
    .map(entry => entry.replace(/\.md$/, ''))
    .filter(entry => !['_toc', 'all', 'documentation', 'index'].includes(entry))
    .filter(entry => entry === 'fs') // TODO: remove

  debug('found modules: %o', modNames)
  modNames.forEach(modName => generateMod(modName))
}

// https://nodefoo.com/api/buffer
// https://nodefoo.com/api/buffer/Buffer
// https://nodefoo.com/api/buffer/Buffer/from-class-method
// https://nodefoo.com/api/buffer/Buffer/slice-method
// https://nodefoo.com/api/buffer/Buffer/length-property

function generateMod (modName) {
  const mappings = getMappings(modName)
  const docPath = path.join(REPO_API_PATH, modName + '.md')
  const doc = fs.readFileSync(docPath, 'utf8')

  let sections = doc.split(/^#+ |\n#+ /)

  // sections[0] = sections[0].replace('# ', '')

  sections = sections
    .filter(Boolean)
    .map((section, i) => {
      const firstNewlineIndex = section.indexOf('\n')
      const title = section.slice(0, firstNewlineIndex)
      const body = section.slice(firstNewlineIndex).trim()

      const [url, expectedTitle] = mappings[i]
      assert.equal(title, expectedTitle)

      return { title, body, url }
    })

  sections.forEach((section, i) => {
    const filePath = path.join(OUT_PATH, modName, section.url + '.md')
    mkdirp.sync(path.dirname(filePath))

    let body = '# ' + section.title + '\n\n' + section.body + '\n'
    if (pathExists.sync(filePath)) body = '\n' + body

    fs.appendFileSync(filePath, body)
  })
}

function getMappings (modName) {
  const file = fs.readFileSync(path.join(BIN_PATH, modName + '.txt'), 'utf8')
  const lines = file.split('\n').filter(Boolean)

  const mappings = lines.map(line => {
    const firstSpaceIndex = line.indexOf(' ')
    const url = line.slice(0, firstSpaceIndex).trim()
    const title = line.slice(firstSpaceIndex).trim()
    return [url, title]
  })

  return mappings
}
