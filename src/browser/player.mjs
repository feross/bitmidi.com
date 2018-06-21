import Timidity from 'timidity'

let player

export function load (url) {
  player = new Timidity('/timidity')
  player.load(url)
}

export function play () {
  player.play()
}
