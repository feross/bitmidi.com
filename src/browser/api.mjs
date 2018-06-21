import Debug from 'debug'
import querystring from 'querystring'

import config from '../../config'
import simpleFetch from '../lib/simple-fetch'

const debug = Debug('bitmidi:api')

export default {
  midi: {
    get: opts => sendGet('/midi/get', opts),
    all: opts => sendGet('/midi/all', opts),
    search: opts => sendGet('/midi/search', opts),
    random: opts => sendGet('/midi/random', opts)
  }
}

function sendGet (urlBase, params) {
  return sendRequest('GET', urlBase, params)
}

async function sendRequest (method, urlBase, params) {
  const opts = {
    url: '/api' + urlBase + '?' + querystring.stringify(params),
    json: true,
    method: method,
    timeout: config.apiTimeout
  }
  debug('request %s', opts.url)

  let res
  try {
    res = await simpleFetch(opts)
  } catch (err) {
    throw new Error(`HTTP request error. ${err.message}`)
  }

  const { body } = res
  if (body.error) {
    let err = new Error(body.error.message)
    if (body.error.code) err.code = body.error.code
    throw err
  }

  if (res.statusCode !== 200) {
    throw new Error(`HTTP response error. ${res.statusCode}`)
  }

  return body.result
}
