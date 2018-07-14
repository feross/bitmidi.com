exports.up = knex => {
  return knex.schema
    .table('midis', table => {
      table.timestamps(true, true)
    })
}

exports.down = knex => {
  return knex.schema
    .table('midis', table => {
      table.dropTimestamps()
    })
}
