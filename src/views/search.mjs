import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import Input from './input'

export default class Search extends Component {
  constructor () {
    super()
    this.state = {
      focused: false
    }
  }

  render (props, state, { store, theme }) {
    const { class: className, ...rest } = props
    const { focused } = state
    const { lastSearch } = store
    const { headerColor } = theme

    return (
      <Input
        borderColor={headerColor}
        class={c({
          'o-90': !focused
        }, 'grow-subtle', className)}
        pill
        onInput={this.handleInput}
        onKeyPress={this.handleKeyPress}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        placeholder='Search'
        value={lastSearch}
        {...rest}
      />
    )
  }

  dispatch (value) {
    const { dispatch } = this.context
    dispatch('SEARCH_INPUT', value)
  }

  handleInput = event => {
    const value = event.target.value
    this.dispatch(value)
  }

  handleKeyPress = event => {
    event.stopPropagation()
    if (event.key === 'Enter') {
      const value = event.target.value
      if (value.trim() !== '') this.dispatch(value)
    }
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  handleBlur = () => {
    this.setState({ focused: false })
  }
}
