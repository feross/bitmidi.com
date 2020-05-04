import get from 'simple-get'
import Router from 'express-promise-router'
import { readFile } from 'fs'
import { join } from 'path'

import * as config from '../config'

const { rootPath } = config

let adsTxtOptimize = ''
let adsTxtNewor = ''
let adsTxtAdsense = ''

function updateAdsTxt () {
  get.concat('https://cdn4.buysellads.net/ads.txt', (err, _, body) => {
    if (err) throw err
    adsTxtOptimize = body.toString()
  })

  readFile(join(rootPath, 'static', 'ads-newor.txt'), (err, file) => {
    if (err) throw err
    adsTxtNewor = file
  })

  readFile(join(rootPath, 'static', 'ads-adsense.txt'), (err, file) => {
    if (err) throw err
    adsTxtAdsense = file
  })
}

updateAdsTxt()
setInterval(updateAdsTxt, 24 * 60 * 60 * 1000)

const router = Router()

// Serve ads.txt redirect
router.get('/ads.txt', (req, res) => {
  const body = adsTxtOptimize + '\n' + adsTxtNewor + '\n' + adsTxtAdsense
  res.setHeader('content-type', 'text/plain')
  res.send(body)
})

export default router
