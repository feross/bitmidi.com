#!/usr/bin/env node

const gitPull = require('git-pull-or-clone')
const path = require('path')

const config = require('../config')

const DOCS_PATH = path.join(config.root, 'docs')
const NODE_REPO_PATH = path.join(config.root, 'tmp', 'node')

gitPull('git@github.com:nodejs/node.git', NODE_REPO_PATH, (err) => {
  if (err) throw err
  console.log('success')
})
