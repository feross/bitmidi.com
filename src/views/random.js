import { toChildArray } from 'preact'

const ROTATE_INTERVAL = 10 * 60 * 1000 // 10 minutes

const Random = ({ children }) => {
  children = toChildArray(children)
  const index = Math.floor(Date.now() / ROTATE_INTERVAL) % children.length
  return children[index]
}

export default Random
