import schedule from 'node-schedule'

import shareTwitter from './share-twitter'
import { isProd } from '../config'

const DAILY = '0 0 * * *'

export default function init (port) {
  const isMainProcess = port % 10 === 0
  if (isProd && isMainProcess) {
    schedule.scheduleJob(DAILY, shareTwitter)
  }
}
