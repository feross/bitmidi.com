import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'
import loadScript from 'load-script2'

import { isBrowser, isProd, tokens } from '../config'

export default class CarbonAd extends Component {
  componentDidMount () {
    if (!isBrowser || !isProd) return
    loadScript(`https://cdn.carbonads.com/carbon.js?serve=${tokens.carbon}`, {
      id: '_carbonads_js'
    }, this.elem)
  }

  shouldComponentUpdate () {
    return false
  }

  render (props) {
    const { class: className, ...rest } = props

    if (!isProd) {
      return (
        <div
          class={c('bg-washed-red h4', className)}
          style={{ maxWidth: 330 }}
          {...rest}
        >
          Carbon
        </div>
      )
    }

    return (
      <div>
        <div ref={this.ref} class={className} {...rest} />
        <style dangerouslySetInnerHTML={{
          __html: `
          #carbonads {
            display: flex;
            max-width: 330px;
            background-color: hsl(0, 0%, 98%);
            box-shadow: 0 1px 4px 1px hsla(0, 0%, 0%, .1);
            margin: 0 auto;
          }

          #carbonads a {
            color: inherit;
            text-decoration: none;
          }

          #carbonads a:hover {
            color: inherit;
          }

          #carbonads span {
            position: relative;
            display: block;
            overflow: hidden;
          }

          #carbonads .carbon-wrap {
            display: flex;
          }

          .carbon-img {
            display: block;
            margin: 0;
            line-height: 1;
          }

          .carbon-img img {
            display: block;
          }

          .carbon-text {
            font-size: 13px;
            padding: 10px;
            line-height: 1.5;
            text-align: left;
          }

          .carbon-poweredby {
            display: block;
            padding: 8px 10px;
            background: repeating-linear-gradient(-45deg, transparent, transparent 5px, hsla(0, 0%, 0%, .025) 5px, hsla(0, 0%, 0%, .025) 10px) hsla(203, 11%, 95%, .4);
            text-align: center;
            text-transform: uppercase;
            letter-spacing: .5px;
            font-weight: 600;
            font-size: 9px;
            line-height: 1;
          }
          @media (prefers-color-scheme: dark) {
            #carbonads {
              background-color: hsl(0, 0%, 20%);
            }
          }
        `
        }}
        />
      </div>
    )
  }

  ref = (elem) => {
    this.elem = elem
  }
}
