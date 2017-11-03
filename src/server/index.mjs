/* eslint-disable import/first */

import config from '../../config'
import secret from '../../secret'

import Opbeat from 'opbeat'

if (config.isProd) {
  global.opbeat = Opbeat.start(secret.opbeat)
}

import babelRegister from '@babel/register'

// Automatically compile view files with babel (for JSX)
babelRegister({ only: [/src\/views/], extensions: ['.js', '.jsm'] })

import ConnectSQLite from 'connect-sqlite3'
import downgrade from 'downgrade'
import http from 'http'
import path from 'path'
import session from 'express-session'
import unlimited from 'unlimited'

import app from './app'

const server = http.createServer()

server.listen(config.port, (err) => {
  if (err) throw err
  console.log('Listening on port %s', server.address().port)

  unlimited() // Upgrade the max file descriptor limit
  downgrade() // Set the process user identity to 'www-data'

  // Open DB as 'www-data' user
  const SQLiteStore = ConnectSQLite(session)
  const sessionStore = new SQLiteStore({ dir: path.join(config.rootPath, 'db') })

  server.on('request', app.init(sessionStore))
})
