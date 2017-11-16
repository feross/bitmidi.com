import './opbeat'
import './babel-register'

import ConnectSQLite from 'connect-sqlite3'
import http from 'http'
import path from 'path'
import session from 'express-session'

import config from '../../config'
import { init as appInit } from './app'

const server = http.createServer()

function init (port = 4000, cb = (err) => { if (err) throw err }) {
  server.listen(port, (err) => {
    if (err) cb(err)
    console.log('Listening on port %s', server.address().port)

    // Open DB as 'www-data' user
    const SQLiteStore = ConnectSQLite(session)
    const sessionStore = new SQLiteStore({ dir: path.join(config.rootPath, 'db') })

    server.on('request', appInit(sessionStore))

    cb(null)
  })
}

export { init, server }
