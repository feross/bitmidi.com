exports.up = knex => {
  return knex.schema
    .table('midis', table => {
      table.integer('views').defaultTo(0).notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .table('midis', table => {
      table.dropColumn('views')
    })
}
