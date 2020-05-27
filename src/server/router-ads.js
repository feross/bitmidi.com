import get from 'simple-get'
import Router from 'express-promise-router'
import { readFile } from 'fs'
import { join } from 'path'

import * as config from '../config'

const { rootPath } = config

let adsTxtOptimize = ''
let adsTxtAdsense = ''
// let adsTxtNewor = ''

function updateAdsTxt () {
  readFile(join(rootPath, 'static', 'ads-adsense.txt'), (err, file) => {
    if (err) throw err
    adsTxtAdsense = file
  })

  get.concat('https://cdn4.buysellads.net/ads.txt', (err, _, body) => {
    if (err) throw err
    adsTxtOptimize = body.toString()
  })

  // readFile(join(rootPath, 'static', 'ads-newor.txt'), (err, file) => {
  //   if (err) throw err
  //   adsTxtNewor = file
  // })
}

updateAdsTxt()
setInterval(updateAdsTxt, 24 * 60 * 60 * 1000)

const router = Router()

// Serve ads.txt redirect
router.get('/ads.txt', (req, res) => {
  const body = [
    adsTxtAdsense,
    adsTxtOptimize
    // adsTxtNewor
  ].join('\n')
  res.setHeader('content-type', 'text/plain')
  res.send(body)
})

export default router
