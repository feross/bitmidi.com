const { Component, h } = require('preact') /** @jsx h */
const throttle = require('throttleit')

const routes = require('../routes')

const Link = require('./Link')
const Title = require('./title')

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
    const { store } = context
    const { app, location, errors } = store

    const Page = routes.find(route => route[0] === location.name)[2]

    return (
      <div id='app'>
        <Title title={app.title} />
        <header>
          <h1>NodeFoo</h1>
          <Link href='/'>Home</Link>
          <Link href='/docs/fs/readfile'>fs.readFile</Link>
        </header>
        {errors.map(err => <small>{err}</small>)}
        <Page />
      </div>
    )
  }

  _onResize () {
    const { store } = this.context
    const width = window.innerWidth
    const height = window.innerHeight
    store.dispatch('APP_RESIZE', { width, height })
  }
}

module.exports = App
