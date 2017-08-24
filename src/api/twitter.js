const assert = require('assert')
const memo = require('memo-async-lru')
const Twit = require('twit')

const secret = require('../../secret')

const MEMO_OPTS = {
  max: 50 * 1000,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}

const twit = new Twit({
  consumer_key: secret.twitter.consumerKey,
  consumer_secret: secret.twitter.consumerSecret,
  app_only_auth: true,
  timeout_ms: 60 * 1000
})

function getUser (opts, cb) {
  assert(
    opts != null && typeof opts === 'object',
    '"opts" must be an object'
  )
  assert(
    typeof opts.screen_name === 'string',
    '"opts.screen_name" must be a string'
  )

  twit.get('/users/show', opts, (err, data, res) => {
    if (err) return cb(err)
    cb(null, data)
  })
}

module.exports = {
  getUser: memo(getUser, MEMO_OPTS)
}
