import AboutPage from './views/about-page'
import ErrorPage from './views/error-page'
import HomePage from './views/home-page'
import MidiPage from './views/midi-page'
import SearchPage from './views/search-page'

export default [
  {
    name: 'home',
    path: '/',
    page: HomePage,
    queryDefault: { page: '0' },
    queryWhitelist: ['page']
  },
  {
    name: 'search',
    path: '/search',
    page: SearchPage,
    queryDefault: { page: '0' },
    queryWhitelist: ['page']
  },
  {
    name: 'about',
    path: '/about',
    page: AboutPage
  },
  {
    name: 'midi',
    path: '/:midiSlug',
    page: MidiPage
  },
  {
    name: 'error',
    path: '(.*)',
    page: ErrorPage
  }
]
