const { Component } = require('preact')

class Title extends Component {
  componentDidMount () {
    const { title } = this.props
    this.setTitle(title)
  }

  componentWillReceiveProps (nextProps) {
    const { title } = this.props
    if (title !== nextProps.title) this.setTitle(nextProps.title)
  }

  render () {
    return null
  }

  setTitle (title) {
    if (typeof title !== 'string' && title !== null) {
      throw new Error('"props.title" must be a string or null')
    }
    document.title = title
  }
}

module.exports = Title
