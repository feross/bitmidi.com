import './rollbar'

import http from 'http'
import util from 'util'

import appInit from './app'
import scheduleInit from './schedule'

export default async function init (port) {
  const app = appInit()
  const server = http.createServer(app)

  const listen = util.promisify(server.listen.bind(server))
  await listen(port, '127.0.0.1')
  console.log('Listening on port %s', server.address().port)

  scheduleInit(port)

  return server
}
