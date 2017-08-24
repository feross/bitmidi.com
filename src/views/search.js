const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

class Search extends Component {
  render (props) {
    const { store } = this.context
    const { lastSearch } = store

    return (
      <input
        type='text'
        class={c(
          'input-reset ba b--black-20 ph3 pv2 br-pill outline-0 db',
          props.class
        )}
        spellCheck='false'
        placeholder='Search'
        value={lastSearch}
        onInput={this.onInput}
        onKeyPress={this.onKeyPress}
        onFocus={this.onFocus}
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

module.exports = Search
