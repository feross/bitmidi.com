const config = require('../../config')
const secret = require('../../secret')

if (config.isProd) {
  global.opbeat = require('opbeat').start(secret.opbeat)
}

const babelRegister = require('babel-register')

// Automatically compile JS files with babel when required
babelRegister({ extensions: ['.js'] })

const ConnectSQLite = require('connect-sqlite3')
const downgrade = require('downgrade')
const http = require('http')
const path = require('path')
const session = require('express-session')
const unlimited = require('unlimited')

const app = require('./app')

const server = http.createServer()

server.listen(config.port, (err) => {
  if (err) throw err
  console.log('Listening on port %s', server.address().port)

  unlimited() // Upgrade the max file descriptor limit
  downgrade() // Set the process user identity to 'www-data'

  // Open DB as 'www-data' user
  const SQLiteStore = ConnectSQLite(session)
  const sessionStore = new SQLiteStore({ dir: path.join(config.root, 'db') })

  server.on('request', app.init(sessionStore))
})
