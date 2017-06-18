const html = require('choo/html')
const choo = require('choo')
const debug = require('debug')('nodefoo')

const app = choo()

app.use(logger)
app.use(store)

app.route('/api/:id', mainView)

app.mount('body')

function logger (state, emitter) {
  emitter.on('*', function (type, data) {
    debug('%s %o', type, data)
  })
}

let route = null

function mainView (state, emitter) {
  // var newRoute = window.location.href
  // if (newRoute != route) {
  //   route = newRoute
  //   emitter.emit('fetchProduct')
  // }

  return html`
    <body>
      <h1>
        product is ${state.product.name}
      </h1>
    </body>
  `
}

function store (state, emitter) {
  // emitter.on('fetchProduct', function () {
  //   fetch('/product/'+state.params.id,function (product) {
  //      state.product = product;
  //      emitter.emit('render')
  //   })
  // })
}
