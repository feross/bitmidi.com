const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

class Input extends Component {
  constructor () {
    super()
    this.state = {
      focused: false
    }
  }

  componentDidMount () {
    const { autofocus } = this.props
    if (autofocus) this.elem.focus()
  }

  render (props) {
    const { mainColor } = this.context.theme
    const {
      class: className,
      borderColor = 'black-50',
      borderFocusColor = mainColor,
      type = 'text',
      pill = false,
      onFocus: _,
      onBlur: _2,
      ...rest
    } = props
    const { focused } = this.state

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

module.exports = Input
