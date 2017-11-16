import test from 'tape'
import puppeteer from 'puppeteer'

import { init as serverInit, server } from '../src/server'

// helper to add async-await support to tape
const helper = fn => t => fn(t).catch(err => { throw err })

test('start server', t => {
  t.plan(1)
  serverInit(0, err => t.error(err))
})

test('home page loads', helper(async t => {
  t.plan(2)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const port = server.address().port
  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' })

  const store = await page.evaluate(() => {
    return window.NodeFoo.store
  })

  t.equal(store.app.fetchCount, 0, 'app.fetchCount = 0 (after network idle)')
  t.equal(store.app.isLoaded, true, 'app.isLoaded = true (after network idle)')

  await browser.close()
}))

test('stop server', t => {
  t.plan(1)
  server.close(err => t.error(err))
})
