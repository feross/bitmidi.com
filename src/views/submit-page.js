const { Component, h } = require('preact') /** @jsx h */

const CodeEditor = require('./code-editor')
const Heading = require('./heading')
const Input = require('./input')

class SubmitPage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { dispatch } = this.context
    dispatch('APP_TITLE', 'Submit a Recipe')
  }

  render (props) {
    return (
      <div>
        <Heading>Submit a Recipe</Heading>
        <div>
          <Input placeholder='Recipe Name' class='mv3' />
          <CodeEditor class='mv3' />
        </div>
      </div>
    )
  }
}

module.exports = SubmitPage
