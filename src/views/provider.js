import Provider from 'preact-context-provider'

import { theme } from '../config'

import App from '../views/app'

export default function getProvider (store, dispatch) {
  return (
    <Provider dispatch={dispatch} store={store} theme={theme}>
      <App />
    </Provider>
  )
}
