const { Component, h } = require('preact') /** @jsx h */

const c = require('classnames')

const config = require('../../config')

let CodeMirror

if (config.isBrowser) {
  CodeMirror = require('codemirror')

  require('codemirror/addon/comment/comment') // Comment/uncomment keyboard shortcut
  require('codemirror/addon/dialog/dialog')
  require('codemirror/addon/display/placeholder') // Add `placeholder` option
  require('codemirror/addon/edit/closebrackets')
  require('codemirror/addon/edit/matchbrackets')
  require('codemirror/addon/fold/brace-fold')
  require('codemirror/addon/fold/foldcode')
  require('codemirror/addon/wrap/hardwrap')
  require('codemirror/keymap/sublime') // Sublime keyboard shortcuts
  require('codemirror/mode/javascript/javascript')
}

class CodeEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      focused: false
    }
  }

  componentDidMount () {
    if (!config.isBrowser) return

    const { placeholder } = this.props

    this._codeMirror = CodeMirror.fromTextArea(this._elem, {
      autoCloseBrackets: true,
      indentUnit: 2,
      keyMap: 'sublime',
      lineWrapping: true,
      matchBrackets: true,
      mode: 'javascript',
      placeholder: placeholder,
      showCursorWhenSelecting: true,
      tabIndex: 2,
      tabSize: 2,
      theme: 'monokai',
      viewportMargin: Infinity
    })

    this._codeMirror.on('focus', this._onFocus)
    this._codeMirror.on('blur', this._onBlur)
  }

  componentWillUnmount () {
    if (!config.isBrowser) return

    this._codeMirror.toTextArea()
    this._codeMirror.off('focus', this._onFocus)
    this._codeMirror.off('blur', this._onBlur)

    this._codeMirror = null
  }

  render (props) {
    const { focused } = this.state
    const borderColor = focused ? 'b--dark-pink' : 'b--black-50'

    return (
      <div class={c('br2', borderColor, props.class)}>
        <textarea ref={this._ref} />
      </div>
    )
  }

  _ref = (elem) => {
    this._elem = elem
  }

  _onFocus = () => {
    this.setState({ focused: true })
  }

  _onBlur = () => {
    this.setState({ focused: false })
  }
}

module.exports = CodeEditor
