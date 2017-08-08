const config = require('../config')

if (config.isProd) {
  const secret = require('../secret')
  global.opbeat = require('opbeat').start(secret.opbeat)
}

const babelRegister = require('babel-register')
const ConnectSQLite = require('connect-sqlite3')
const downgrade = require('downgrade')
const http = require('http')
const path = require('path')
const session = require('express-session')
const unlimited = require('unlimited')

// Automatically compile views (which contain JSX) when required, on the fly.
babelRegister({
  // only: /views/,
  extensions: ['.js']
})

const app = require('./app')

unlimited() // Upgrade the max file descriptor limit

const server = http.createServer()
server.listen(config.port, onListening)

function onListening (err) {
  if (err) throw err
  console.log('Listening on port %s', server.address().port)

  downgrade() // Set the process user identity to 'www-data'

  // Open DB as 'www-data' user
  const SQLiteStore = ConnectSQLite(session)
  const sessionStore = new SQLiteStore({ dir: path.join(config.root, 'db') })

  app.init(server, sessionStore)
}
