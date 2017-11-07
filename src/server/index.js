const config = require('../../config')
const secret = require('../../secret')

const Opbeat = require('opbeat')

if (config.isProd) {
  global.opbeat = Opbeat.start(secret.opbeat)
}

// Server should be running as www-data by the time babel-register runs, since it
// reads/writes a .cache folder and it should be deleteable.
require('babel-register')

// TODO: uncomment when https://github.com/babel/babel/issues/6737 is fixed
// Automatically compile view files with babel (for JSX)
// babelRegister({ only: [/views/], extensions: ['.js', '.jsm'] })

const ConnectSQLite = require('connect-sqlite3')
const http = require('http')
const path = require('path')
const session = require('express-session')

const app = require('./app')

const server = http.createServer()

function init (port = 4000, cb = (err) => { if (err) throw err }) {
  server.listen(port, (err) => {
    if (err) cb(err)
    console.log('Listening on port %s', server.address().port)

    // Open DB as 'www-data' user
    const SQLiteStore = ConnectSQLite(session)
    const sessionStore = new SQLiteStore({ dir: path.join(config.rootPath, 'db') })

    server.on('request', app.init(sessionStore))

    cb(null)
  })
}

// If this module is run from the command line, init the server immediately
if (!module.parent) init(process.argv[2])

module.exports = { init, server }
