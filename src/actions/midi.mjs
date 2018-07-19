import api from '../api'

export const doMidiGet = opts => async dispatch => {
  dispatch('MIDI_GET_START', opts)
  const data = await api.midi.get(opts)
  dispatch('MIDI_GET_DONE', data)
  return data
}

export const doMidiAll = opts => async dispatch => {
  dispatch('MIDI_ALL_START', opts)
  const data = await api.midi.all({ orderBy: 'plays', ...opts })
  dispatch('MIDI_ALL_DONE', data)
  return data
}

export const doMidiSearch = opts => async dispatch => {
  dispatch('MIDI_SEARCH_START', opts)
  const data = await api.midi.search(opts)
  dispatch('MIDI_SEARCH_DONE', data)
  return data
}

export const doGoMidiRandom = opts => async dispatch => {
  dispatch('MIDI_RANDOM_START', opts)
  const data = await api.midi.random()
  dispatch('MIDI_RANDOM_DONE', data)
  return data
}
