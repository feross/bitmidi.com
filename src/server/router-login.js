const express = require('express')
const LoginTwitter = require('login-with-twitter')

const config = require('../../config')
const secret = require('../../secret')

const router = express.Router()

const loginTwitter = new LoginTwitter(Object.assign({
  callbackUrl: `${config.httpOrigin}/auth/twitter/callback`
}, secret.twitter))

router.get('/twitter', (req, res, next) => {
  if (req.session.user) {
    // Redirect logged-in users to the homepage
    return res.redirect('/')
  }

  loginTwitter.login((err, tokenSecret, url) => {
    if (err) return next(err)

    // Save token secret in the session object
    req.session.tokenSecret = tokenSecret

    // Redirect to Twitter authorization page
    res.redirect(url)
  })
})

router.get('/twitter/callback', (req, res, next) => {
  if (req.session.user) {
    // Redirect logged-in users to the homepage
    return res.redirect('/')
  }

  loginTwitter.callback(req.query, req.session.tokenSecret, (err, user) => {
    if (err) return next(err)

    // Delete the saved token secret
    delete req.session.tokenSecret

    // Save the user object in the session object
    req.session.user = user

    console.log(user)

    // Redirect user to the homepage
    res.redirect('/')
  })
})

router.get('/twitter/logout', (req, res) => {
  // Delete the user object from the session
  delete req.session.user

  // Redirect the user to the homepage
  res.redirect('/')
})

module.exports = router
