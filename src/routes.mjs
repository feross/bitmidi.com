import api from './api'

import AboutPage from './views/about-page'
import ErrorPage from './views/error-page'
import HomePage from './views/home-page'
import MidiPage from './views/midi-page'
import RandomPage from './views/random-page'
import SearchPage from './views/search-page'

export default [
  {
    name: 'home',
    path: '/',
    page: HomePage,
    query: { page: '0' },
    sitemap: true
  },
  {
    name: 'about',
    path: '/about',
    page: AboutPage,
    sitemap: true
  },
  {
    name: 'search',
    path: '/search',
    page: SearchPage,
    query: { page: '0', q: '' }
  },
  {
    name: 'random',
    path: '/random',
    page: RandomPage
  },
  {
    name: 'midi',
    path: '/:midiSlug',
    page: MidiPage,
    sitemap: async () => {
      const { results } = await api.midi.all({
        select: ['slug'],
        orderBy: 'views',
        pageSize: Infinity
      })
      return results.map(result => result.url)
    }
  },
  {
    name: 'error',
    path: '(.*)',
    page: ErrorPage
  }
]
