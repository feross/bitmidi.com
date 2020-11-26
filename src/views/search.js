import { Component } from 'preact'
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
        pill
        borderColor={headerColor}
        class={c({
          'o-90': !focused
        }, 'grow-subtle', className)}
        placeholder='Search for MIDI files'
        value={lastSearch}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onInput={this.handleInput}
        onKeyPress={this.handleKeyPress}
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
