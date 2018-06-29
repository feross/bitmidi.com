import api from '../api'

export const doGetMidi = opts => async dispatch => {
  dispatch('API_MIDI_GET')
  const data = await api.midi.get(opts)
  dispatch('API_MIDI_GET_DONE', data)
  return data
}
