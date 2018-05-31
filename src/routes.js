/**
 * List of routes in the app. Specified as [routeName, routePath, routePage].
 */

const ErrorPage = require('./views/error-page')
const HomePage = require('./views/home-page')
const SearchPage = require('./views/search-page')
const SnippetPage = require('./views/snippet-page')

module.exports = [
  ['home', '/', HomePage],
  ['search', '/search', SearchPage],
  ['snippet', '/:snippetId', SnippetPage],
  ['error', '(.*)', ErrorPage]
]
