import Opbeat from 'opbeat'

import config from '../../config'
import secret from '../../secret'

if (config.isProd) {
  global.opbeat = Opbeat.start(secret.opbeat)
}
