/*
 * TODO: Rename to .mjs file extension once this issue is fixed:
 * https://github.com/avajs/ava/issues/631#issuecomment-357733734
 */

import puppeteer from 'puppeteer'
import test from 'ava'
import util from 'util'

import { init as serverInit } from '../src/server'

let server = null

test.before('start server', async t => {
  server = await serverInit(0)
})

test('home page loads', async t => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const port = server.address().port
  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle2' })

  const store = await page.evaluate(() => {
    return window.NodeFoo.store
  })

  t.is(store.app.fetchCount, 0, 'app.fetchCount = 0 (after network idle)')
  t.is(store.app.isLoaded, true, 'app.isLoaded = true (after network idle)')

  await browser.close()
})

test.after('stop server', async t => {
  const close = util.promisify(server.close.bind(server))
  await close()
})
