import './opbeat'

import http from 'http'
import util from 'util'

import appInit from './app'

// TODO: Remove when upgrading to Node 10
import nodeUrl from 'url'
global.URL = nodeUrl.URL
global.URLSearchParams = nodeUrl.URLSearchParams

export default async function init (port) {
  const app = appInit()
  const server = http.createServer(app)

  const listen = util.promisify(server.listen.bind(server))
  await listen(port)
  console.log('Listening on port %s', server.address().port)

  return server
}
