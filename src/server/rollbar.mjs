import Rollbar from 'rollbar'
import { isProd } from '../config'
import { rollbar as rollbarSecret } from '../../secret'

if (isProd) {
  global.rollbar = new Rollbar({
    accessToken: rollbarSecret.accessToken,
    captureUncaught: true,
    captureUnhandledRejections: true
  })
}
