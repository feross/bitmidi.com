exports.up = knex => {
  return knex.schema
    .table('midis', table => {
      table.boolean('shared_twitter').defaultTo(false)
    })
}

exports.down = knex => {
  return knex.schema
    .table('midis', table => {
      table.dropColumn('shared_twitter')
    })
}
