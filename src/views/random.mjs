const Random = ({ children }) => {
  const $randomChild = children[Math.floor(Math.random() * children.length)]
  return $randomChild
}

export default Random
