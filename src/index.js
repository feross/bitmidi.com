const html = require('choo/html')
const choo = require('choo')
const log = require('nanologger')('nodefoo')

const api = require('./api')

const app = choo()

app.use(logger)
app.use(store)

app.route('/', mainView)
app.route('/docs/*', docsView)

function logger (state, emitter) {
  emitter.on('*', function (type, data) {
    log.info('%s %o', type, data)
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
  window.state = state

  emitter.on('FETCH_DOC', function () {
    const url = '/' + state.params.wildcard
    api.doc({ url }, (err, doc) => {
      if (err) throw err
      state.doc = doc
      emitter.emit('render')
    })
  })
}

app.mount('body')
