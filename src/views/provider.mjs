import { h } from 'preact' /** @jsx h */
import Provider from 'preact-context-provider'

import config from '../../config'

import App from '../views/app'

export default function getProvider (store, dispatch) {
  return (
    <Provider store={store} dispatch={dispatch} theme={config.theme}>
      <App />
    </Provider>
  )
}
