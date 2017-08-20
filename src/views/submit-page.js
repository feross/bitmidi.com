const { Component, h } = require('preact') /** @jsx h */

const CodeEditor = require('./code-editor')
const Button = require('./button')
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
          <Input
            placeholder='Recipe Name'
            class='mv3 w-50'
          />
          <CodeEditor
            placeholder='// Write code here...'
            class='mv3'
          />
          <Button size='medium' fill onClick={() => alert('submit')}>Submit</Button>
        </div>
      </div>
    )
  }
}

module.exports = SubmitPage
