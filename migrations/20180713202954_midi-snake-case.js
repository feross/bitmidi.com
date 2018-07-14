exports.up = knex => {
  return knex.schema
    .table('midis', table => {
      table.renameColumn('alternateNames', 'alternate_names')
    })
}

exports.down = knex => {
  return knex.schema
    .table('midis', table => {
      table.renameColumn('alternate_names', 'alternateNames')
    })
}
