const { Component } = require('preact') /** @jsx h */

class Title extends Component {
  componentDidMount () {
    const { title } = this.props
    this._setTitle(title)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.title !== nextProps.title) this._setTitle(nextProps.title)
  }

  render (props) {
    return null
  }

  _setTitle (title) {
    if (title) document.title = title
  }
}

module.exports = Title
