exports.up = knex => {
  return knex.schema
    .table('midis', table => {
      table.integer('plays').defaultTo(0).notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .table('midis', table => {
      table.dropColumn('plays')
    })
}
