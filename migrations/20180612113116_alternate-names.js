exports.up = knex => {
  return knex.schema
    .table('midis', table => {
      table.text('alternateNames')
    })
}

exports.down = knex => {
  return knex.schema
    .table('midis', table => {
      table.dropColumn('alternateNames')
    })
}
