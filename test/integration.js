import puppeteer from 'puppeteer'
import test from 'ava'
import util from 'util'

import serverInit from '../src/server'

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
    return window.App.store
  })

  t.is(store.app.pending, 0, 'app.pending = 0 (after network idle)')
  t.is(store.app.isLoaded, true, 'app.isLoaded = true (after network idle)')

  await browser.close()
})

test.after('stop server', async t => {
  const close = util.promisify(server.close.bind(server))
  await close()
})
