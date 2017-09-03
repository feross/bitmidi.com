const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

class Search extends Component {
  constructor () {
    super()
    this.state = {
      focused: false
    }
  }

  render (props) {
    const { class: className, ...rest } = props
    const { lastSearch } = this.context.store
    const { mainColor } = this.context.theme
    const { focused } = this.state

    const borderColor = focused ? `b--${mainColor}` : 'dark-pink'

    return (
      <input
        type='text'
        class={c(
          'dib input-reset ba bw1 ph3 pv2 br-pill outline-0 sans-serif',
          borderColor,
          className
        )}
        spellCheck='false'
        placeholder='Search'
        value={lastSearch}
        onInput={this.onInput}
        onKeyPress={this.onKeyPress}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        {...rest}
      />
    )
  }

  dispatch (value) {
    const { dispatch } = this.context
    dispatch('SEARCH_INPUT', value)
  }

  onInput = (event) => {
    const value = event.target.value
    this.dispatch(value)
  }

  onKeyPress = (event) => {
    event.stopPropagation()
    if (event.key === 'Enter') {
      const value = event.target.value
      if (value.trim() !== '') this.dispatch(value)
    }
  }

  onFocus = (event) => {
    this.setState({ focused: true })
    const value = event.target.value
    if (value.trim() !== '') this.dispatch(value)
  }

  onBlur = () => {
    this.setState({ focused: false })
  }
}

module.exports = Search
