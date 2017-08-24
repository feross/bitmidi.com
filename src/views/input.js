const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

class Input extends Component {
  constructor () {
    super()
    this.state = {
      focused: false
    }
  }

  render (props) {
    const { class: className, ...rest } = props
    const { focused } = this.state

    const borderColor = focused ? 'b--dark-pink' : 'b--black-50'

    return (
      <input
        type='text'
        class={c(
          'input-reset ba bw1 ph3 pv2 br2 outline-0 db',
          borderColor,
          className
        )}
        spellCheck='false'
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        {...rest}
      />
    )
  }

  onFocus = () => {
    this.setState({ focused: true })
  }

  onBlur = () => {
    this.setState({ focused: false })
  }
}

module.exports = Input
