import Timidity from 'timidity'

let player

function initPlayer () {
  if (player) return
  player = new Timidity('/timidity')
  player.on('unstarted', () => console.log('unstarted'))
  player.on('playing', () => console.log('playing'))
  player.on('paused', () => console.log('paused'))
  player.on('ended', () => dispatch('MIDI_ENDED'))
  player.on('buffering', () => console.log('buffering'))
  player.on('timeupdate', (time) => console.log('timeupdate', time))
  player.on('error', (err) => console.log('error', err))
}

export function load (url) {
  initPlayer()
  player.load(url)
}

export function play () {
  initPlayer()
  player.play()
}

export function pause () {
  initPlayer()
  player.pause()
}
