import Rollbar from 'rollbar'
import { isProd } from '../config'
import { rollbar as rollbarSecret } from '../../secret'

if (isProd) {
  global.rollbar = new Rollbar({
    accessToken: rollbarSecret.accessToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    checkIgnore: (isUncaught, args) => {
      // Ignore 404 errors
      const err = args[0]
      return !isUncaught && err && err.status === 404
    }
  })
}
