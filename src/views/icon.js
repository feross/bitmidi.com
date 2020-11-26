import c from 'classnames'

import Image from './image'

const Icon = props => {
  const {
    name,
    class: className,
    color = '#000',
    size = 30,
    ...rest
  } = props

  const [categoryName, iconName] = name.split('/')

  if (iconName == null) {
    throw new Error('Prop `name` must have format "categoryName/iconName"')
  }

  const isWhite = colorIsWhite(color)
  const isBlack = colorIsBlack(color)

  // When the color is white or black, use a simple PNG image
  if (isWhite || isBlack) {
    const color = isWhite ? 'white' : 'black'
    const src = `/icons/${categoryName}/2x_web/ic_${iconName}_${color}_48dp.png`
    return (
      <Image
        alt={null}
        class={c('lh-solid v-btm', className)}
        src={src}
        style={{
          width: size,
          height: size
        }}
        {...rest}
      />
    )
  }

  // When the color is not white or black, use a div with a background-color and
  // an SVG mask. (This approach doesn't work in EdgeHTML 17)
  const src = `/icons/${categoryName}/svg/production/ic_${iconName}_48px.svg`
  return (
    <div
      class={c('lh-solid v-btm', className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url("${src}")`,
        WebkitMaskSize: 'cover',
        maskImage: `url("${src}")`,
        maskSize: 'cover'
      }}
      {...rest}
    />
  )
}

const colorIsWhite = color => ['#fff', '#ffffff', 'white'].includes(color)
const colorIsBlack = color => ['#000', '#000000', 'black'].includes(color)

export default Icon
