const { Component, h } = require('preact') /** @jsx h */

const c = require('classnames')

const config = require('../../config')

let CodeMirror

if (config.isBrowser) {
  CodeMirror = require('codemirror')

  require('codemirror/addon/edit/closebrackets')
  require('codemirror/addon/dialog/dialog')
  require('codemirror/addon/edit/matchbrackets')
  require('codemirror/addon/edit/closebrackets')

  // Addon for commenting and uncommenting code
  require('codemirror/addon/comment/comment')

  require('codemirror/addon/wrap/hardwrap')
  require('codemirror/addon/fold/foldcode')
  require('codemirror/addon/fold/brace-fold')

  require('codemirror/mode/javascript/javascript')
  require('codemirror/keymap/sublime')
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

    this._codeMirror = CodeMirror.fromTextArea(this._elem, {
      indentUnit: 2,
      mode: 'javascript',
      tabSize: 2,
      keyMap: 'sublime',
      viewportMargin: Infinity,
      autoCloseBrackets: true,
      lineWrapping: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      theme: 'monokai'
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
