const { Component, h } = require('preact') /** @jsx h */
const throttle = require('throttleit')

const store = require('../store')
const config = require('../../config')

const HomePage = require('./home-page')
const NotFoundPage = require('./not-found-page')
const Title = require('./title')
const Link = require('./Link')

const PAGES = {
  'home': HomePage,
  'not-found': NotFoundPage
}

class App extends Component {
  constructor (props) {
    super(props)
    this._onResizeThrottled = throttle(this._onResize.bind(this), 500)
  }

  componentDidMount () {
    this._onResize()
    window.addEventListener('resize', this._onResizeThrottled)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._onResizeThrottled)
  }

  render (props, state, context) {
    console.log(props, state, context)
    const { store } = context
    const { app, entity, location } = store

    const Page = PAGES[location.name] || PAGES['not-found']

    const title = app.title
      ? app.title + ' – ' + config.name
      : config.name

    return (
      <div id='app'>
        <Title title={title} />
        <header>
          <h1>NodeFoo</h1>
          <Link href='/'>Home</Link>
          <Link href='/docs/fs/readfile'>fs.readFile</Link>
        </header>
        <Page entity={entity} />
      </div>
    )
  }

  _onResize () {
    const width = window.innerWidth
    const height = window.innerHeight
    store.dispatch('APP_RESIZE', { width, height })
  }
}

module.exports = App
