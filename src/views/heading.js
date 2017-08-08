const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Heading = (props) => {
  return (
    <h2
      class={c('fw6 pv0 mb3 mt4', props.class)}
      style={{
        fontSize: '2rem'
      }}
    >
      {props.children}
    </h2>
  )
}

module.exports = Heading
