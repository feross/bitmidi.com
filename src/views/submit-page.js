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
    dispatch('APP_TITLE', 'Submit a Code Snippet')
  }

  render (props) {
    const { isPending } = this.state
    return (
      <div>
        <Heading>Submit a Code Snippet</Heading>
        <div>
          <Input
            placeholder='Snippet Name'
            class='mv3 w-50'
            onChange={this._onInputChange}
          />
          <CodeEditor
            placeholder='// Write code here...'
            class='mv3'
            onChange={this._onCodeEditorChange}
          />
          <Button
            size='medium'
            color='purple'
            fill
            disabled={isPending}
            onClick={this._onClick}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }

  _onInputChange = (event) => {
    this._inputValue = event.target.value
  }

  _onCodeEditorChange = (value) => {
    this._codeEditorValue = value
  }

  _onClick = () => {
    const { dispatch } = this.context

    this.setState({ isPending: true })

    dispatch('FETCH_SNIPPET_ADD', {
      name: this._inputValue,
      code: this._codeEditorValue
    })
  }
}

module.exports = SubmitPage
