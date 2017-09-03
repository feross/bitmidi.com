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

    this._codeMirror.on('change', this.onChange)
  }

  componentWillReceiveProps (nextProps) {
    const { value } = this.props
    if (nextProps.value !== value &&
        nextProps.value !== this._codeMirror.getValue()) {
      this._codeMirror.setValue(nextProps.value)
    }
  }

  componentWillUnmount () {
    if (!config.isBrowser) return

    this._codeMirror.setValue('')
    this._codeMirror.toTextArea()
    this._codeMirror.off('change', this.onChange)
    this._codeMirror = null
  }

  render (props) {
    return (
      <div class={props.class}>
        <textarea ref={this.ref} />
      </div>
    )
  }

  ref = (elem) => {
    this.elem = elem
  }

  onChange = () => {
    const { onChange } = this.props
    const value = this._codeMirror.getValue()
    onChange(value)
  }
}

module.exports = CodeEditor
