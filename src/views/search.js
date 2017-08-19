const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

class Search extends Component {
  constructor (props) {
    super(props)
    this._onInput = this._onInput.bind(this)
    this._onKeyPress = this._onKeyPress.bind(this)
    this._onFocus = this._onFocus.bind(this)
  }

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
        onInput={this._onInput}
        onKeyPress={this._onKeyPress}
        onFocus={this._onFocus}
      />
    )
  }

  _onInput (event) {
    const value = event.target.value
    this._dispatch(value)
  }

  _onKeyPress (event) {
    event.stopPropagation()
    if (event.key === 'Enter') {
      const value = event.target.value
      if (value.trim() !== '') this._dispatch(value)
    }
  }

  _onFocus (event) {
    const value = event.target.value
    if (value.trim() !== '') this._dispatch(value)
  }

  _dispatch (value) {
    const { dispatch } = this.context
    dispatch('SEARCH_INPUT', value)
  }
}

module.exports = Search
