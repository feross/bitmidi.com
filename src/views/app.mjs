import { Component, h } from 'preact' /** @jsx h */

import routes from '../routes'

import Header from './header'
import Footer from './footer'
import Title from './title'

export default class App extends Component {
  render (props) {
    const { app, location, fatalError, errors } = this.context.store

    if (fatalError) location.name = 'error'

    const Page = routes.find(route => route.name === location.name).page

    return (
      <div id='root'>
        <Title title={app.title} />
        <Header />
        <main class='mt4 mb5 ph2 ph3-m ph3-l mw7 center'>
          <Page url={location.url} />
          {errors.map(err => <small>{err.message}</small>)}
        </main>
        <Footer />
      </div>
    )
  }
}
