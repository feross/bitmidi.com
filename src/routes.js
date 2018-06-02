/**
 * List of routes in the app. Specified as [routeName, routePath, routePage].
 */

const ErrorPage = require('./views/error-page')
const HomePage = require('./views/home-page')
const MidiPage = require('./views/midi-page')
// const SearchPage = require('./views/search-page')

module.exports = [
  ['home', '/', HomePage],
  // ['search', '/search', SearchPage],
  ['midi', '/:midiId', MidiPage],
  ['error', '(.*)', ErrorPage]
]
