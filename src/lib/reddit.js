// TODO: publish to npm

const querystring = require('querystring')
const get = require('simple-get')
const debug = require('debug')('reddit')

const TOKEN_BASE_URL = 'https://www.reddit.com/api/v1/access_token'
const API_BASE_URL = 'https://oauth.reddit.com'
const REQUEST_TIMEOUT = 30 * 1000

class Reddit {
  constructor (opts) {
    this.username = opts.username
    this.password = opts.password
    this.appId = opts.appId
    this.appSecret = opts.appSecret
    this.userAgent = opts.userAgent || 'reddit (https://github.com/feross/reddit)'

    this.token = null
    this.tokenExpiration = 0
  }

  async get (url, opts) {
    return this._sendRequest('GET', API_BASE_URL + url, opts)
  }

  async post (url, opts) {
    return this._sendRequest('POST', API_BASE_URL + url, opts)
  }

  async patch (url, opts) {
    return this._sendRequest('PATCH', API_BASE_URL + url, opts)
  }

  async put (url, opts) {
    return this._sendRequest('PUT', API_BASE_URL + url, opts)
  }

  async delete (url, opts) {
    return this._sendRequest('DELETE', API_BASE_URL + url, opts)
  }

  async _sendRequest (method, url, opts) {
    const token = await this._getToken()
    const data = await this._makeRequest(method, url, opts, token)

    const errors = data && data.json && data.json.errors
    if (errors && errors.length > 0) {
      throw new Error(errors.map(error => `${error[0]}: ${error[1]} (${error[2]})`).join('. '))
    }

    return data
  }

  async _getToken () {
    if (Date.now() / 1000 <= this.tokenExpiration) {
      return this.token
    }

    return new Promise((resolve, reject) => {
      get.concat({
        url: TOKEN_BASE_URL,
        method: 'POST',
        form: {
          grant_type: 'password',
          username: this.username,
          password: this.password
        },
        headers: {
          authorization: `Basic ${Buffer.from(`${this.appId}:${this.appSecret}`).toString('base64')}`,
          'user-agent': this.userAgent
        },
        json: true,
        timeout: REQUEST_TIMEOUT
      }, (err, res, body) => {
        if (err) {
          err.message = `Error getting token: ${err.message}`
          return reject(err)
        }

        const statusType = Math.floor(res.statusCode / 100)

        if (statusType === 2) {
          const {
            access_token: accessToken,
            expires_in: expiresIn,
            token_type: tokenType
          } = body

          if (tokenType == null || accessToken == null) {
            return reject(new Error(`Cannot obtain token for username ${this.username}. ${body.error}.`))
          }

          this.token = `${tokenType} ${accessToken}`
          // Shorten token expiration time by half to avoid race condition where
          // token is valid at request time, but server will reject it
          this.tokenExpiration = ((Date.now() / 1000) + expiresIn) / 2

          return resolve(this.token)
        } else if (statusType === 4) {
          return reject(
            new Error(`Cannot obtain token for username ${this.username}. Did you give the user access in your Reddit App Preferences? ${body.error}. Status code: ${res.statusCode}`)
          )
        } else {
          return reject(
            new Error(`Cannot obtain token for username ${this.username}. ${body.error}. Status code: ${res.statusCode}`)
          )
        }
      })
    })
  }

  _makeRequest (method, url, data, token) {
    return new Promise((resolve, reject) => {
      const opts = {
        url: url,
        method: method,
        headers: {
          authorization: token,
          'user-agent': this.userAgent
        },
        timeout: REQUEST_TIMEOUT
      }

      // Request JSON API response type
      data.api_type = 'json'

      if (method === 'GET') {
        opts.url += querystring.encode(data)
      } else if (method === 'POST') {
        opts.form = data
        opts.json = true
      } else if (method === 'PATCH' || method === 'PUT' || method === 'DELETE') {
        opts.body = data
        opts.json = true
      }

      debug(`Making ${method} request to ${url}`)

      get.concat(opts, (err, res, body) => {
        if (err) {
          err.message = `API error: ${err.message}`
          return reject(err)
        }

        debug('Got a response with statusCode: ' + res.statusCode)

        const statusType = Math.floor(res.statusCode / 100)

        if (statusType === 2) {
          return resolve(body)
        } else {
          return reject(
            new Error(`API error: ${body.message}. Status code: ${res.statusCode}`)
          )
        }
      })
    })
  }
}

module.exports = Reddit
