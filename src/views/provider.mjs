import { h } from 'preact' /** @jsx h */
import Provider from 'preact-context-provider'

import { theme } from '../config'

import App from '../views/app'

export default function getProvider (store, dispatch) {
  return (
    <Provider store={store} dispatch={dispatch} theme={theme}>
      <App />
    </Provider>
  )
}
