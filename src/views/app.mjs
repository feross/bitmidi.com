import { Component, h } from 'preact' /** @jsx h */
import throttle from 'throttleit'

import config from '../../config'
import routes from '../routes'

import Header from './header'
import Footer from './footer'
import Title from './title'

export default class App extends Component {
  constructor () {
    super()
    this.onResizeThrottled = throttle(this.onResize, 500)
  }

  componentDidMount () {
    if (config.isBrowser) {
      this.onResize()
      window.addEventListener('resize', this.onResizeThrottled)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResizeThrottled)
  }

  render (props) {
    const { app, location, fatalError, errors } = this.context.store

    if (fatalError) location.name = 'error'

    const Page = routes.find(route => route.name === location.name).page

    return (
      <div id='root'>
        <Title title={app.title} />
        <Header />
        <div class='mt5 pa2 pa3-m pa3-l mw7 center'>
          <main>
            <Page url={location.url} />
            {errors.map(err => <small>{err.message}</small>)}
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  onResize = () => {
    const { dispatch } = this.context
    const width = window.innerWidth
    const height = window.innerHeight
    dispatch('APP_RESIZE', { width, height })
  }
}
