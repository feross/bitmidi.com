import './opbeat'

import ConnectSQLite from 'connect-sqlite3'
import http from 'http'
import path from 'path'
import session from 'express-session'
import util from 'util'

import config from '../../config'
import { init as appInit } from './app'

export async function init (port) {
  const server = http.createServer()

  const listen = util.promisify(server.listen.bind(server))
  await listen(port)

  const SQLiteStore = ConnectSQLite(session)
  const sessionStore = new SQLiteStore({ dir: path.join(config.rootPath, 'db') })
  server.on('request', appInit(sessionStore))

  console.log('Listening on port %s', server.address().port)

  return server
}
