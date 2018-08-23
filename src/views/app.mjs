import { Component, h } from 'preact' /** @jsx h */

import routes from '../routes'

import Header from './header'
import Footer from './footer'
import Title from './title'

export default class App extends Component {
  render (props, _, { store }) {
    const { app, errors, fatalError, location } = store

    const routeName = fatalError ? 'error' : location.name
    const route = routes.find(route => route.name === routeName)
    const Page = route.page

    return (
      <div id='root'>
        <Title title={app.title} />
        <Header />
        <main class='mt4 mb5 ph3 ph3-safe mw7 center'>
          <Page url={location.url} />
          <div class='tc light-gray'>
            {errors.map(err => <div><small>{err.message}</small></div>)}
          </div>
        </main>
        <Footer />
      </div>
    )
  }
}
