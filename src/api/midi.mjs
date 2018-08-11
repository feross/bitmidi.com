import Debug from 'debug'

import Midi from '../models/midi'

const debug = Debug('bitmidi:api:midi')

const PAGE_SIZE = 10

// HACK: hardcode some images so homepage looks nice
const IMAGES = [
  { re: 'aladdin', url: 'aladdin.jpg' },
  { re: 'backstreet', url: 'backstreet.jpg' },
  { re: 'blink182', url: 'blink182.jpg' },
  { re: 'blink-182', url: 'blink182.jpg' },
  { re: 'jingle bells', url: 'christmas.jpg' },
  { re: 'jingle-bells', url: 'christmas.jpg' },
  { re: 'usa', url: 'bornintheusa.jpg' },
  { re: 'kingdom hearts', url: 'kingdomhearts.jpg' },
  { re: 'lion king', url: 'lionking.jpg' },
  { re: 'mario', url: 'mario.jpg' },
  { re: 'pokemon', url: 'pokemon.jpg' },
  { re: 'simpsons', url: 'simpsons.jpg' },
  { re: 'star wars', url: 'starwars.jpg' },
  { re: 'star-wars', url: 'starwars.jpg' },
  { re: 'super smash', url: 'supersmash.png' },
  { re: 'zelda', url: 'zelda.jpg' }
]

function addImage (result) {
  for (const image of IMAGES) {
    if (result.name && result.name.toLowerCase().includes(image.re)) {
      result.image = `/img/covers/${image.url}`
      break
    }
  }
}

async function get (query = {}) {
  debug('get %o', query)
  const result = await Midi
    .query()
    .findOne(query)
    .throwIfNotFound()

  addImage(result)

  await result
    .$query()
    .increment('views', 1)

  return { query, result }
}

async function play (query = {}) {
  debug('play %o', query)
  await Midi
    .query()
    .findOne(query)
    .throwIfNotFound()
    .increment('plays', 1)
  return { query }
}

async function all (query = {}) {
  query.page = Number(query.page) || 0
  query.pageSize = Number(query.pageSize) || PAGE_SIZE
  query.orderBy = query.orderBy || 'plays'
  query.select = query.select || '*'
  debug('all %o', query)

  const { total, results } = await Midi
    .query()
    .select(query.select)
    .orderBy(query.orderBy, 'desc')
    .page(query.page, query.pageSize)

  results.forEach(addImage)

  return { query, results, total, pageTotal: getPageTotal(total, query.pageSize) }
}

async function search (query = {}) {
  query.page = Number(query.page) || 0
  query.pageSize = Number(query.pageSize) || PAGE_SIZE
  query.select = query.select || '*'
  debug('search %o', query)

  const { total, results } = await Midi
    .query()
    .select(query.select)
    .whereRaw('MATCH(name) AGAINST(? IN NATURAL LANGUAGE MODE)', query.q)
    .page(query.page, query.pageSize)

  return { query, results, total, pageTotal: getPageTotal(total, query.pageSize) }
}

async function random (query = {}) {
  const result = await Midi
    .query()
    .orderByRaw('RAND()')
    .findOne({})
  return { query, result }
}

function getPageTotal (total, pageSize) {
  return Math.ceil(total / pageSize)
}

export default { get, play, all, search, random }
