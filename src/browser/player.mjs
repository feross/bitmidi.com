import Timidity from 'timidity'

let player

function initPlayer () {
  if (player) return
  player = new Timidity('/timidity')
}

export function load (url) {
  initPlayer()
  player.load(url)
}

export function play () {
  initPlayer()
  player.play()
}
