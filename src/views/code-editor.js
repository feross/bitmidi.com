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
  constructor () {
    super()
    this.state = {
      focused: false
    }
  }

  componentDidMount () {
    if (!config.isBrowser) return

    const { placeholder } = this.props

    this._codeMirror = CodeMirror.fromTextArea(this.elem, {
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

    this._codeMirror.on('focus', this.onFocus)
    this._codeMirror.on('blur', this.onBlur)
    this._codeMirror.on('change', this.onChange)
  }

  componentWillUnmount () {
    if (!config.isBrowser) return

    this._codeMirror.toTextArea()
    this._codeMirror.off('focus', this.onFocus)
    this._codeMirror.off('blur', this.onBlur)
    this._codeMirror.off('change', this.onChange)

    this._codeMirror = null
  }

  render (props) {
    const { focused } = this.state
    const borderColor = focused ? 'b--dark-pink' : 'b--black-50'

    return (
      <div class={c('br2', borderColor, props.class)}>
        <textarea ref={this.ref} />
      </div>
    )
  }

  ref = (elem) => {
    this.elem = elem
  }

  onFocus = () => {
    this.setState({ focused: true })
  }

  onBlur = () => {
    this.setState({ focused: false })
  }

  onChange = () => {
    const { onChange } = this.props
    const value = this._codeMirror.getValue()
    onChange(value)
  }
}

module.exports = CodeEditor
