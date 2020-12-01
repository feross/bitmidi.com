import { Component } from 'preact'

export default class Title extends Component {
  componentDidMount () {
    const { title } = this.props
    this.setTitle(title)
  }

  componentWillReceiveProps (nextProps) { // eslint-disable-line react/no-deprecated
    const { title } = this.props
    if (title !== nextProps.title) this.setTitle(nextProps.title)
  }

  render () {
    return null
  }

  setTitle (title) {
    if (typeof title !== 'string' && title !== null) {
      throw new Error('Prop `title` must be a string or null')
    }
    document.title = title
  }
}
