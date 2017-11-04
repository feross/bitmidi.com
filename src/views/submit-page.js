const { h } = require('preact') /** @jsx h */

const Button = require('./button')
const CodeEditor = require('./code-editor')
const Heading = require('./heading')
const Input = require('./input')
const Loader = require('./loader')
const PageComponent = require('./page-component')
const { oneLine } = require('common-tags')

class SubmitPage extends PageComponent {
  constructor () {
    super()
    this.state = {
      inputValue: '',
      codeEditorValue: ''
    }
  }

  load () {
    const { dispatch } = this.context
    dispatch('APP_META', {
      title: 'Add a Code Snippet',
      description: oneLine`
        Add a code snippet to NodeFoo, a site devoted to sharing the best Node.js
        examples and code snippets.
      `
    })
  }

  render (props) {
    const { inputValue, codeEditorValue } = this.state
    const { fetchCount } = this.context.store.app
    return (
      <Loader>
        <Heading>Add a Code Snippet ✨</Heading>
        <div>
          <Input
            autofocus
            placeholder='Snippet Name'
            class='mv3 w-70'
            onChange={this.onInputChange}
            value={inputValue}
            ref={this.inputRef}
          />
          <CodeEditor
            placeholder='// Write code here...'
            class='mv3'
            onChange={this.onCodeEditorChange}
            value={codeEditorValue}
            ref={this.codeEditorRef}
          />
          <Button
            size='medium'
            pill
            fill
            disabled={fetchCount > 0}
            onClick={this.onClick}
          >
            Submit 🌟
          </Button>
        </div>
      </Loader >
    )
  }

  inputRef = (elem) => {
    this.inputElem = elem
  }

  codeEditorRef = (elem) => {
    this.codeEditorElem = elem
  }

  onInputChange = (event) => {
    this.setState({ inputValue: event.target.value })
  }

  onCodeEditorChange = (value) => {
    this.setState({ codeEditorValue: value })
  }

  onClick = () => {
    const { dispatch } = this.context

    dispatch('API_SNIPPET_ADD', {
      name: this.state.inputValue,
      code: this.state.codeEditorValue
    })
  }
}

module.exports = SubmitPage
