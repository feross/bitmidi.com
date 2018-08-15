import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser } from '../config'

export default class Input extends Component {
  constructor () {
    super()
    this.state = {
      focused: false
    }
  }

  componentDidMount () {
    const { autofocus } = this.props
    if (isBrowser && autofocus) this.elem.focus()
  }

  render (props, state, { theme }) {
    const {
      class: className,
      borderColor = 'black-50',
      borderFocusColor = theme.mainColor,
      type = 'text',
      pill = false,
      onFocus: _,
      onBlur: _2,
      placeholder,
      ...rest
    } = props
    const { focused } = state

    const focusClass = focused
      ? `b--${borderFocusColor} shadow-4`
      : `b--${borderColor}`

    const pillClass = pill ? 'br-pill' : 'br2'

    return (
      <input
        class={c(
          'db input-reset ba bw1 ph3 pv2 outline-0 sans-serif',
          focusClass,
          pillClass,
          className
        )}
        ref={this.ref}
        spellCheck='false'
        type={type}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        placeholder={placeholder}
        aria-label={placeholder}
        {...rest}
      />
    )
  }

  ref = (elem) => {
    this.elem = elem
  }

  onFocus = (event) => {
    const { onFocus } = this.props
    this.setState({ focused: true })
    if (onFocus) onFocus(event)
  }

  onBlur = (event) => {
    const { onBlur } = this.props
    this.setState({ focused: false })
    if (onBlur) onBlur(event)
  }
}
