const ROTATE_INTERVAL = 60 * 1000 // 60 secs

const Random = ({ children }) => {
  const index = Math.floor(Date.now() / ROTATE_INTERVAL) % children.length
  return children[index]
}

export default Random
