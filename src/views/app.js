import { Component, h } from 'preact' /** @jsx h */

import routes from '../routes'

import Header from './header'
import Footer from './footer'
import Title from './title'
import { PageLevelAd } from './ads'

export default class App extends Component {
  render (props, _, { store }) {
    const { app, errors, fatalError, location } = store

    const routeName = fatalError ? 'error' : location.name
    const route = routes.find(route => route.name === routeName)
    const Page = route.page

    if (Page.showAppShell) {
      return (
        <div>
          <Title title={app.title} />
          <Header />
          <main class='mt4 mb5 ph3 ph3-safe mw7 center break-word'>
            <Page isServerRendered={app.isServerRendered} url={location.url} />
            <div class='tc light-gray'>
              {errors.map(err => <div key={err.message}><small>{err.message}</small></div>)}
            </div>
            <PageLevelAd />
          </main>
          <Footer />
        </div>
      )
    } else {
      return (
        <div>
          <Title title={app.title} />
          <Page isServerRendered={app.isServerRendered} url={location.url} />
          <div class='tc light-gray'>
            {errors.map(err => <div key={err.message}><small>{err.message}</small></div>)}
          </div>
        </div>
      )
    }
  }
}
