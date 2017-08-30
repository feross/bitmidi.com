const { Component, h } = require('preact') /** @jsx h */

const CodeEditor = require('./code-editor')
const Button = require('./button')
const Heading = require('./heading')
const Input = require('./input')

class SubmitPage extends Component {
  componentDidMount () {
    this.load()
    this.state = {
      isPending: false
    }
  }

  load () {
    const { dispatch } = this.context
    dispatch('APP_TITLE', 'Add a Code Snippet')
  }

  render (props) {
    const { isPending } = this.state
    return (
      <div>
        <Heading>Add a Code Snippet</Heading>
        <div>
          <Input
            placeholder='Snippet Name'
            class='mv3 w-50'
            onChange={this.onInputChange}
          />
          <CodeEditor
            placeholder='// Write code here...'
            class='mv3'
            onChange={this.onCodeEditorChange}
          />
          <Button
            size='medium'
            color='purple'
            fill
            disabled={isPending}
            onClick={this.onClick}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }

  onInputChange = (event) => {
    this.inputValue = event.target.value
  }

  onCodeEditorChange = (value) => {
    this.codeEditorValue = value
  }

  onClick = () => {
    const { dispatch } = this.context

    this.setState({ isPending: true })

    dispatch('FETCH_SNIPPET_ADD', {
      name: this.inputValue,
      code: this.codeEditorValue
    })
  }
}

module.exports = SubmitPage
