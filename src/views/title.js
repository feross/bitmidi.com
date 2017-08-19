const { Component } = require('preact') /** @jsx h */

class Title extends Component {
  componentDidMount () {
    const { title } = this.props
    this._setTitle(title)
  }

  componentWillReceiveProps (nextProps) {
    const { title } = this.props
    if (title !== nextProps.title) this._setTitle(nextProps.title)
  }

  render () {
    return null
  }

  _setTitle (title) {
    if (typeof title !== 'string' && title !== null) {
      throw new Error('"props.title" must be a string or null')
    }
    document.title = title
  }
}

module.exports = Title
