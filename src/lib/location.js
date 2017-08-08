// TODO: publish to npm

const History = require('./history')
const Router = require('./router')

class Location {
  constructor (routes, onChange) {
    this._onChange = onChange
    this._onHistoryChange = this._onHistoryChange.bind(this)
    this._onClick = this._onClick.bind(this)

    this._router = new Router(routes)

    this._history = new History(this._onHistoryChange)

    document.addEventListener('click', this._onClick)

    // Trigger an initial 'change' event
    this.replace(window.location.pathname)
  }

  push (pathname) {
    this._history.push(pathname)
  }

  replace (pathname) {
    this._history.replace(pathname)
  }

  back () {
    this._history.back()
  }

  forward () {
    this._history.forward()
  }

  destroy () {
    this._history.destroy()

    document.removeEventListener('click', this._onClick)

    this._onChange = null
    this._onHistoryChange = null
    this._router = null
    this._history = null
  }

  _onHistoryChange (pathname, source) {
    const loc = this._router.match(pathname)
    this._onChange(loc, source)
  }

  _onClick (e) {
    // Ignore if click was not left mouse button
    if (e.button !== 0) return

    // Ignore if modifier keys were pressed during click
    if (e.metaKey || e.ctrlKey || e.shiftKey) return

    // Ignore if user called event.preventDefault()
    if (e.defaultPrevented) return

    // Ignore if click was not on an 'A' tag (use shadow dom when available)
    let el = e.path ? e.path[0] : e.target
    while (el && el.nodeName !== 'A') el = el.parentNode
    if (!el || el.nodeName !== 'A') return

    // Ignore if tag has 'download' or rel='external' attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return

    // Ignore if link points to current page and uses a hash
    const href = el.getAttribute('href')
    if (el.pathname === window.location.pathname && (el.hash || href === '#')) return

    // Ignore if link contains 'mailto:'
    if (href && href.indexOf('mailto:') > -1) return

    // Ignore if link has a target
    if (el.target) return

    // Ignore if link is not from the same origin
    if (el.origin !== window.location.origin) return

    e.preventDefault()

    const pathname = el.pathname + el.search + (el.hash || '')
    this.push(pathname)
  }
}

module.exports = Location
