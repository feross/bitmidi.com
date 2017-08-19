const { Component, h } = require('preact') /** @jsx h */
const throttle = require('throttleit')

const config = require('../../config')
const routes = require('../routes')

const Header = require('./header')

class App extends Component {
  constructor (props) {
    super(props)
    this._onResizeThrottled = throttle(this._onResize.bind(this), 500)
  }

  componentDidMount () {
    if (config.isBrowser) {
      this._onResize()
      window.addEventListener('resize', this._onResizeThrottled)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._onResizeThrottled)
  }

  render (props) {
    const { store } = this.context
    const { location, errors } = store

    const Page = routes.find(route => route[0] === location.name)[2]

    return (
      <div id='app'>
        <Header />
        <div class='mw8 center'>
          <Page />
        </div>
        {errors.map(err => <small>{err}</small>)}
      </div>
    )
  }

  _onResize () {
    const { dispatch } = this.context
    const width = window.innerWidth
    const height = window.innerHeight
    dispatch('APP_RESIZE', { width, height })
  }
}

module.exports = App
