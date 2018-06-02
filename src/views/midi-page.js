const { h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const Loader = require('./loader')
const Midi = require('./midi')
const PageComponent = require('./page-component')

class MidiPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const { location } = this.context.store
    const { midiId } = location.params

    dispatch('API_MIDI_GET', { id: midiId })
    dispatch('APP_META', { title: 'TODO', description: 'TODO' })
  }

  render (props) {
    const { store } = this.context
    const { location, midis } = store
    const { midiId } = location.params

    const midi = midis[midiId]
    return (
      <Loader show={midi == null} center>
        <Heading>{midi && midi.name}</Heading>
        <Midi midi={midi} />
      </Loader>
    )
  }
}

module.exports = MidiPage
