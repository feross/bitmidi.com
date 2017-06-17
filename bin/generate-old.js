#!/usr/bin/env node

const debug = require('debug')('nodefoo:generate')
const fs = require('fs')
const get = require('simple-get')
const gitPull = require('git-pull-or-clone')
const mkdirp = require('mkdirp')
const path = require('path')
const pathExists = require('path-exists')
const rimraf = require('rimraf')

const config = require('../config')

const DOCS_URL = 'https://nodejs.org/dist/latest-v8.x/docs/api/'

const DOCS_PATH = path.join(config.root, 'docs')
const REPO_PATH = path.join(config.root, 'tmp', 'node')
const REPO_API_PATH = path.join(REPO_PATH, 'doc', 'api')

rimraf.sync(DOCS_PATH)

pull()
// getModNames()
// generateMod('buffer')

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

  debug('found modules: %o', modNames)
  modNames.forEach(modName => generateMod(modName))
}

// https://nodefoo.com/api/buffer
// https://nodefoo.com/api/buffer/Buffer
// https://nodefoo.com/api/buffer/Buffer/from-class-method
// https://nodefoo.com/api/buffer/Buffer/slice-method
// https://nodefoo.com/api/buffer/Buffer/length-property

function generateMod (modName) {
  // const docPath = path.join(REPO_API_PATH, modName + '.md')
  // const doc = fs.readFileSync(docPath, 'utf8')

  get.concat(DOCS_URL + modName + '.json', (err, res, data) => {
    if (err) throw err
    data = JSON.parse(data.toString())
    console.log(modName)
    const mod = (data.modules && data.modules[0]) ||
      (data.miscs && data.miscs[0]) ||
      (data.globals && data.globals[0])

    mod.name = mod.name.toLowerCase()

    // Treat the top-level module like a class for doc-generating purposes
    if (!mod) console.log('NO NAME', data)
    generateClass(mod, DOCS_PATH)
  })
}

function generateClass (cls, docPath) {
  const classPath = path.join(docPath, cls.name)
  mkdirp.sync(classPath)

  const { methods = [], properties = [], classes = [] } = cls

  methods.forEach(method => {
    const methodFileName = sanitize(method.name) + '.json'
    const methodPath = path.join(classPath, methodFileName)
    safeWriteSync(methodPath, JSON.stringify(method, undefined, 2))
  })

  properties.forEach(property => {
    const propertyFileName = sanitize(property.name) + '.json'
    const propertyPath = path.join(classPath, propertyFileName)
    safeWriteSync(propertyPath, JSON.stringify(property, undefined, 2))
  })

  classes.forEach(cls => {
    generateClass(cls, path.join(classPath))
  })

  delete cls.methods
  delete cls.properties
  delete cls.classes

  const indexPath = path.join(classPath, 'index.json')
  safeWriteSync(indexPath, JSON.stringify(cls, undefined, 2))
}

function safeWriteSync (file, data) {
  if (pathExists.sync(file)) console.log('duplicate file: ' + file)
  // if (pathExists.sync(file)) throw new Error('duplicate file: ' + file)
  fs.writeFileSync(file, data)
}

function sanitize (name) {
  if (name === '[index]') return 'index-square-brackets'
  return name
}
