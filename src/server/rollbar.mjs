import Rollbar from 'rollbar'
import { isProd } from '../config'
import { rollbar as rollbarSecret } from '../../secret'

if (isProd) {
  global.rollbar = new Rollbar({
    accessToken: rollbarSecret.accessToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    checkIgnore: (isUncaught, args) => {
      const err = args[0]

      // Never ignore uncaught errors
      if (isUncaught) return false

      // Ignore 'Not Found' errors
      if (err.status === 404) return true

      // Ignore 'Range Not Satisfiable' errors
      if (err.status === 416) return true

      return false
    }
  })
}
