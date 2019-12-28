// TODO: publish to npm

export default async function asyncFlatMap (arr, asyncFn) {
  return Promise.all(flat(await asyncMap(arr, asyncFn)))
}

function asyncMap (arr, asyncFn) {
  return Promise.all(arr.map(asyncFn))
}

function flat (arr) {
  return [].concat(...arr)
}
