import schedule from 'node-schedule'

import shareReddit from './share-reddit'
import shareTwitter from './share-twitter'
import { isProd } from '../config'

const DAILY_12AM = '0 0 * * *'
const DAILY_5PM = '0 17 * * *'

export default function init (port) {
  const isMainProcess = port % 10 === 0
  if (isProd && isMainProcess) {
    schedule.scheduleJob(DAILY_5PM, shareReddit)
    schedule.scheduleJob(DAILY_12AM, shareTwitter)
  }
}
