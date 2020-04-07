import api from './api'

import AboutPage from './views/about-page'
import EmbedPage from './views/embed-page'
import ErrorPage from './views/error-page'
import HomePage from './views/home-page'
import MidiPage from './views/midi-page'
import PrivacyPage from './views/privacy-page'
import RandomPage from './views/random-page'
import RelatedPage from './views/related-page'
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
    name: 'privacy',
    path: '/privacy',
    page: PrivacyPage
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
    name: 'related',
    path: '/:midiSlug/related',
    page: RelatedPage,
    query: { page: '0' }
  },
  {
    name: 'embed',
    path: '/embed/:midiSlug',
    query: { autoplay: '0' },
    page: EmbedPage,
    canonicalUrl: loc => `/${loc.params.midiSlug}`
  },
  {
    name: 'error',
    path: '(.*)',
    page: ErrorPage
  }
]
