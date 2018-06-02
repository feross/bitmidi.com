import Midi from '../src/models/midi'

init()

async function init () {
  await Midi
    .query()
    .insert({ name: 'Pokemon_2.mid' })

  const midis = await Midi
    .query()

  console.log(midis)

  return Midi.knex().destroy()
}
