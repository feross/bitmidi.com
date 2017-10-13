/**
 * List of routes in the app. Specified as [routeName, routePath, routePage].
 */

const DocPage = require('./views/doc-page')
const ErrorPage = require('./views/error-page')
const HomePage = require('./views/home-page')
const SnippetPage = require('./views/snippet-page')
const SubmitPage = require('./views/submit-page')

module.exports = [
  ['home', '/', HomePage],
  ['doc', '/docs/:url+', DocPage],
  ['submit', '/submit', SubmitPage],
  ['snippet', '/:snippetId', SnippetPage],
  ['error', '(.*)', ErrorPage]
]
