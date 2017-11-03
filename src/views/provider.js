module.exports = getProvider

const { h } = require('preact') /** @jsx h */

const App = require('../views/app')
const Provider = require('preact-context-provider')

const config = require('../../config')

function getProvider (store, dispatch) {
  return (
    <Provider store={store} dispatch={dispatch} theme={config.theme}>
      <App />
    </Provider>
  )
}
