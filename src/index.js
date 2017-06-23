const html = require('choo/html')
const choo = require('choo')
const debug = require('debug')('nodefoo')

const api = require('./api')
const URL = require('./lib/url')

const IS_BROWSER = typeof window !== 'undefined'

const app = choo()

if (IS_BROWSER) app.use(logger)
if (IS_BROWSER) app.use(store)

app.route('/', mainView)
app.route('/docs/*', docsView)

function logger (state, emitter) {
  emitter.on('*', (type, data) => {
    debug('%s %o', type, data)
  })
}

function header () {
  return html`
    <header>
      <h1>NodeFoo</h1>
      <a href='/'>Home</a>
      <a href='/docs/fs/readfile'>fs.readFile</a>
    </header>
  `
}

function mainView (state, emit) {
  return html`
    <body>
      ${header()}
      <h1>Home Page</h1>
      <p>
        ${state}
      </p>
    </body>
  `
}

let route = null

function docsView (state, emit) {
  const newRoute = window.location.pathname
  if (newRoute !== route) {
    route = newRoute
    emit('FETCH_DOC')
  }

  return html`
    <body>
      ${header()}
      <h1>Doc Page</h1>
      <p>${state.doc}</p>
    </body>
  `
}

function store (state, emitter) {
  window.state = state // for debugging

  state.location = new URL(window.location.href)

  emitter.on('pushState', (url) => {
    state.location = new URL(url)
  })

  emitter.on('FETCH_DOC', () => {
    const url = '/' + state.params.wildcard
    api.doc({ url }, (err, doc) => {
      if (err) throw err
      state.doc = doc
      emitter.emit('render')
    })
  })
}

app.mount('body')
