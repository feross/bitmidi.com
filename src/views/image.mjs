/* global IntersectionObserver */

// TODO: Use <img lazyload='on' /> once it's supported
// See: https://twitter.com/feross/status/1029134817135353856

import { h, Component } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser } from '../config'

class Image extends Component {
  constructor () {
    super()
    this.observer = null
    this.state = {
      visible: false
    }
  }

  componentDidMount () {
    if (isBrowser) this.observeImage(this.props.src)
  }

  componentDidUpdate (prevProps) {
    if (isBrowser && this.props.src !== prevProps.src) {
      this.cleanup()
      this.observeImage(this.props.src)
    }
  }

  componentWillUnmount () {
    if (isBrowser) this.cleanup()
  }

  render (props, state) {
    const { alt, lazyload = true, src, class: className, ...rest } = props
    const { visible } = state

    if (typeof src !== 'string' || src.length === 0) {
      throw new Error('Prop `src` must be a string of non-zero length')
    }

    if (typeof alt !== 'string' || alt.length === 0) {
      throw new Error('Prop `alt` must be a string of non-zero length')
    }

    const img = (
      <img
        alt={alt}
        class={className}
        decoding='async'
        src={src}
        {...rest}
      />
    )

    // Show image
    if (visible || !lazyload) return img

    // Show placeholder and until image is visible
    return (
      <div>
        <img
          ref={this.ref}
          alt={alt}
          class={c('hide-no-js', className)}
          decoding='async'
          {...rest}
        />
        {!isBrowser && <noscript>{img}</noscript>}
      </div>
    )
  }

  ref = elem => {
    this.elem = elem
  }

  observeImage (src) {
    if (this.elem == null) return
    try {
      this.observer = new IntersectionObserver(([image]) => {
        if (image.isIntersecting) this.showImage()
      }, {
        rootMargin: '300px'
      })
      this.observer.observe(this.elem)
    } catch {
      this.showImage()
    }
  }

  showImage () {
    this.setState({ visible: true })
    this.cleanup()
  }

  cleanup () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

export default Image
