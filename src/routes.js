/**
 * List of routes in the app. Specified as [routeName, routePath, routePage].
 */

const HomePage = require('./views/home-page')
const DocPage = require('./views/doc-page')
const SubmitPage = require('./views/submit-page')
const ErrorPage = require('./views/error-page')

module.exports = [
  ['home', '/', HomePage],
  ['doc', '/docs/:url+', DocPage],
  ['submit', '/submit', SubmitPage],
  ['error', '*', ErrorPage]
]
