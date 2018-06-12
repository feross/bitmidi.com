import { h } from 'preact' /** @jsx h */
import nodeUrl from 'url' // TODO: remove for Node 10

import Button from './button'
import Heading from './heading'
import Loader from './loader'
import Midi from './midi'
import PageComponent from './page-component'

const URL = nodeUrl.URL || window.URL

export default class HomePage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const { location } = this.context.store
    const { page } = location.query

    dispatch('APP_META', { title: null, description: null })
    dispatch('API_MIDI_ALL', { page })
  }

  render (props) {
    const { data, location, views } = this.context.store
    const { page } = location.query

    const midiIds = views.all[page]
    const midis = midiIds
      ? midiIds.map(midiId => data.midis[midiId])
      : []

    return (
      <div>
        <Heading class='tc'>Most popular MIDIs</Heading>
        <Loader show={!midiIds} center>
          {midis.map(midi => <Midi midi={midi} />)}
          <Pagination page={page} total={views.all.total} />
        </Loader>
      </div>
    )
  }
}

const Pagination = (props, context) => {
  const { page: pageStr, total } = props
  const page = Number(pageStr)
  const { location } = context.store

  function getPageUrl (page) {
    const url = new URL(location.url, 'http://example.com')
    url.searchParams.set('page', page)
    return url.pathname + url.search
  }

  const firstPage = Math.max(0, page - 5)
  const lastPage = Math.min(total, firstPage + 10)

  const pages = []
  for (let i = firstPage; i < lastPage; i += 1) {
    pages.push(<Button href={getPageUrl(i)}>{i}</Button>)
  }

  return (
    <div class='tc'>
      {page !== 0 && <Button href={getPageUrl(page - 1)}>‹ Prev</Button>}
      {pages}
      {page !== total - 1 && <Button href={getPageUrl(page + 1)}>Next ›</Button>}
    </div>
  )
}
