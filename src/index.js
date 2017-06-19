const html = require('choo/html')
const choo = require('choo')
const debug = require('debug')('nodefoo')

const api = require('./api')

const app = choo()

app.use(logger)
app.use(store)

app.route('/', mainView)
app.route('/docs/*', apiView)

function logger (state, emitter) {
  emitter.on('*', function (type, data) {
    debug('%s %o', type, data)
  })
}

function mainView (state, emitter) {
  // var newRoute = window.location.href
  // if (newRoute != route) {
  //   route = newRoute
  //   emitter.emit('fetchProduct')
  // }

  return html`
    <body>
      <h1>
        ${state}
      </h1>
    </body>
  `
}

let route = null

function apiView (state, emit) {
  var newRoute = window.location.pathname
  if (newRoute !== route) {
    route = newRoute
    emit('FETCH_DOC')
  }

  return html`
    <body>
      <h1>
        ${state.doc}
      </h1>
    </body>
  `
}

function store (state, emitter) {
  window.state = state

  emitter.on('FETCH_DOC', function () {
    const url = window.location.pathname.replace(/^\/docs/, '')
    api.doc({ url }, (err, doc) => {
      if (err) throw err
      state.doc = doc
      emitter.emit('render')
    })
  })
}

app.mount('body')
