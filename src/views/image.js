
const Image = props => {
  const { alt, class: className, loading = 'lazy', src, style, ...rest } = props

  if (typeof src !== 'string' || src.length === 0) {
    throw new Error('Prop `src` must be a string of non-zero length')
  }

  if ((typeof alt !== 'string' || alt.length === 0) && alt !== null) {
    throw new Error('Prop `alt` must be a string of non-zero length, or null')
  }

  if (props.width != null || props.height != null) {
    throw new Error('Use prop `style` instead of `width` or `height` to set size')
  }

  // Use automatic server-side WebP conversion on absolutely specified images
  // (i.e. /img/test.png)
  const $sources = isAbsolutePath(src) && isConvertibleToWebp(src) && [
    <source
      key='low'
      media='(max-width: 480px)'
      srcset={`/webp${src}.low.webp`}
      type='image/webp'
    />,
    <source
      key='regular'
      srcset={`/webp${src}.webp`}
      type='image/webp'
    />
  ]

  return (
    <picture>
      {$sources}
      <img
        alt={alt === null ? '' : alt}
        class={className}
        decoding='async'
        loading={loading}
        role={alt === null && 'presentation'}
        src={src}
        style={style}
        {...rest}
      />
    </picture>
  )
}

function isAbsolutePath (url) {
  return url[0] === '/'
}

function isConvertibleToWebp (url) {
  return url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.tif')
}

export default Image
