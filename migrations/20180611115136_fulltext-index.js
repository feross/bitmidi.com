exports.up = knex => {
  return knex.schema
    .raw('ALTER TABLE midis ADD FULLTEXT (name)')
}

exports.down = knex => {
  return knex.schema
    .raw('ALTER TABLE midis DROP INDEX name')
}
