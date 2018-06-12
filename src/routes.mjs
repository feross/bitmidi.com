import ErrorPage from './views/error-page'
import HomePage from './views/home-page'
import MidiPage from './views/midi-page'
import SearchPage from './views/search-page'

export default [
  {
    name: 'home',
    path: '/',
    page: HomePage,
    defaultQuery: { page: '0' }
  },
  {
    name: 'search',
    path: '/search',
    page: SearchPage,
    defaultQuery: { page: '0' }
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
