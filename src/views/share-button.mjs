import { h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser } from '../config'

import Icon from './icon'

const ShareButton = (props, context) => {
  const { dispatch } = context
  const { size, class: className, ...rest } = props

  if (!isBrowser || navigator.share == null) return null

  return (
    <Icon
      name='social/share'
      class={c('pointer', className)}
      size={size}
      onClick={() => dispatch('APP_SHARE')}
      {...rest}
    />
  )
}

export default ShareButton
