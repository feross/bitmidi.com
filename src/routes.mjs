/**
 * List of routes in the app. Specified as [routeName, routePath, routePage].
 */

import ErrorPage from './views/error-page'
import HomePage from './views/home-page'
import MidiPage from './views/midi-page'
import SearchPage from './views/search-page'

export default [
  {
    name: 'home',
    path: '/',
    page: HomePage,
  },
  {
    name: 'search',
    path: '/search',
    page: SearchPage
  },
  {
    name: 'midi',
    path: '/:midiId',
    page: MidiPage
  },
  {
    name: 'error',
    path: '(.*)',
    page: ErrorPage
  }
]
