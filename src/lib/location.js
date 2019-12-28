// TODO: publish to npm

import History from './history'
import Router from './router'

const IS_BROWSER = typeof window !== 'undefined'

export default class Location {
  constructor (routes, onChange) {
    this._onChange = onChange

    this._router = new Router(routes)
    this._history = new History(this._onHistoryChange)

    if (IS_BROWSER) document.addEventListener('click', this._onClick)
  }

  push (url) {
    this._history.push(url)
  }

  replace (url) {
    this._history.replace(url)
  }

  back () {
    this._history.back()
  }

  forward () {
    this._history.forward()
  }

  destroy () {
    this._onChange = null
    this._onHistoryChange = null
    this._router = null

    this._history.destroy()
    this._history = null

    if (IS_BROWSER) document.removeEventListener('click', this._onClick)
    this._onClick = null
  }

  _onHistoryChange = (url, source) => {
    const loc = this._router.match(url)
    this._onChange(loc, source)
  }

  _onClick = (e) => {
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

    // Ignore if tag has 'download' attribute
    if (el.hasAttribute('download')) return

    // Ignore if tag has rel='external' attribute
    const rel = el.getAttribute('rel')
    if (rel && rel.split(' ').includes('external')) return

    // Ignore if link has a 'target' attribute
    if (el.target) return

    // Ignore if link points to current page and uses a hash
    const href = el.getAttribute('href')
    if (el.pathname === window.location.pathname &&
        el.search === window.location.search && (el.hash || href === '#')) return

    // Ignore if link contains 'mailto:'
    if (href && href.indexOf('mailto:') >= 0) return

    // Ignore if link is not from the same origin
    if (el.origin !== window.location.origin) return

    e.preventDefault()

    const url = el.pathname + el.search + (el.hash || '')
    this.push(url)
  }
}
