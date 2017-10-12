const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

const Input = require('./input')

class Search extends Component {
  render (props) {
    const { class: className, ...rest } = props
    const { lastSearch } = this.context.store
    const { mainColor, headerColor } = this.context.theme

    return (
      <Input
        borderColor={headerColor}
        borderFocusColor={mainColor}
        class={c(className)}
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
    window.alert('Search is not implemented yet. Coming soon!')
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

module.exports = Search
