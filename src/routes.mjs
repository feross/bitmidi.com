/**
 * List of routes in the app. Specified as [routeName, routePath, routePage].
 */

import ErrorPage from './views/error-page'
import HomePage from './views/home-page'
import MidiPage from './views/midi-page'
// const SearchPage = require('./views/search-page')

export default [
  ['home', '/', HomePage],
  // ['search', '/search', SearchPage],
  ['midi', '/:midiId', MidiPage],
  ['error', '(.*)', ErrorPage]
]
