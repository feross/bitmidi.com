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
    const { alt, lazyload = true, src, class: className, style, ...rest } = props
    const { visible } = state

    if (typeof src !== 'string' || src.length === 0) {
      throw new Error('Prop `src` must be a string of non-zero length')
    }

    if ((typeof alt !== 'string' || alt.length === 0) && alt !== null) {
      throw new Error('Prop `alt` must be a string of non-zero length, or null')
    }

    const role = alt === null ? 'presentation' : null

    // Use automatic server-side WebP conversion on absolutely specified images
    // (i.e. /img/test.png)
    const $source = isAbsolutePath(src) && isConvertibleToWebp(src) &&
      <source srcset={`/webp${src}.webp`} type='image/webp' />

    const $picture = (
      <picture>
        {$source}
        <img
          alt={alt}
          class={className}
          decoding='async'
          role={role}
          src={src}
          style={style}
          {...rest}
        />
      </picture>
    )

    // Show image
    if (visible || !lazyload) return $picture

    // Show placeholder (since image is not visible)
    return (
      <div>
        <div
          ref={this.ref}
          class={c('hide-no-js', className)}
          style={{
            ...style
          }}
          {...rest}
        />
        {!isBrowser && <noscript>{$picture}</noscript>}
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

function isAbsolutePath (url) {
  return url[0] === '/'
}

function isConvertibleToWebp (url) {
  return url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.tif')
}

export default Image
