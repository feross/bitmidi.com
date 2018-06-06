import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import Input from './input'

export default class Search extends Component {
  render (props) {
    const { class: className, ...rest } = props
    const { lastSearch } = this.context.store
    const { mainColor, headerColor } = this.context.theme

    return (
      <Input
        borderColor={headerColor}
        borderFocusColor={mainColor}
        class={c(className, 'grow-subtle')}
        pill
        onInput={this.onInput}
        onKeyPress={this.onKeyPress}
        onFocus={this.onFocus}
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
    const value = event.target.value
    if (value.trim() !== '') this.dispatch(value)
  }
}
