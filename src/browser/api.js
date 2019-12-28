import Debug from 'debug'

import { apiTimeout } from '../config'
import simpleFetch from '../lib/simple-fetch'

const debug = Debug('bitmidi:api')

export default {
  midi: {
    get: opts => sendGet('/midi/get', opts),
    play: opts => sendGet('/midi/play', opts),
    all: opts => sendGet('/midi/all', opts),
    search: opts => sendGet('/midi/search', opts),
    random: opts => sendGet('/midi/random', opts)
  }
}

function sendGet (apiUrl, params) {
  return sendRequest('GET', apiUrl, params)
}

async function sendRequest (method, apiUrl, params) {
  const opts = {
    url: `/api${apiUrl}?${new URLSearchParams(params)}`,
    json: true,
    method: method,
    timeout: apiTimeout
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
    const err = new Error(body.error.message)
    err.code = body.error.code || null
    throw err
  }

  if (res.statusCode !== 200) {
    throw new Error(`HTTP response error. ${res.statusCode}`)
  }

  return body.result
}
