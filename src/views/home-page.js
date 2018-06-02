const { h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const Loader = require('./loader')
const Midi = require('./midi')
const PageComponent = require('./page-component')

class HomePage extends PageComponent {
  load () {
    const { dispatch } = this.context
    dispatch('APP_META', { title: null, description: null })
    dispatch('API_MIDI_ALL')
  }

  render (props) {
    const { topMidiIds, midis } = this.context.store

    const topMidis = topMidiIds &&
      topMidiIds.map(midiId => midis[midiId])

    return (
      <Loader show={topMidiIds.length === 0} center>
        <Heading class='tc'>Most popular MIDIs</Heading>
        {topMidis && topMidis.map(midi => <Midi midi={midi} />)}
      </Loader>
    )
  }
}

module.exports = HomePage
