import './opbeat'
import './babel-register'

import ConnectSQLite from 'connect-sqlite3'
import http from 'http'
import path from 'path'
import session from 'express-session'
import util from 'util'

import config from '../../config'
import { init as appInit } from './app'

const server = http.createServer()

async function init (port) {
  const listen = util.promisify(server.listen.bind(server))
  await listen(port)
  console.log('Listening on port %s', server.address().port)

  const SQLiteStore = ConnectSQLite(session)
  const sessionStore = new SQLiteStore({ dir: path.join(config.rootPath, 'db') })

  server.on('request', appInit(sessionStore))
}

export { init, server }
