import { Component } from 'preact'
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
      borderColor = 'black-50',
      borderFocusColor = theme.mainColor,
      class: className,
      onBlur: _,
      onFocus: _2,
      pill = false,
      placeholder,
      type = 'text',
      ...rest
    } = props
    const { focused } = state

    const focusClass = focused
      ? `b--${borderFocusColor} shadow-4`
      : `b--${borderColor}`

    const pillClass = pill ? 'br-pill' : 'br2'

    return (
      <input
        ref={this.ref}
        aria-label={placeholder}
        class={c(
          'db input-reset ba bw1 ph3 pv2 outline-0 sans-serif',
          focusClass,
          pillClass,
          className
        )}
        placeholder={placeholder}
        spellCheck='false'
        type={type}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        {...rest}
      />
    )
  }

  ref = (elem) => {
    this.elem = elem
  }

  handleFocus = (event) => {
    const { onFocus } = this.props
    this.setState({ focused: true })
    if (onFocus) onFocus(event)
  }

  handleBlur = (event) => {
    const { onBlur } = this.props
    this.setState({ focused: false })
    if (onBlur) onBlur(event)
  }
}
