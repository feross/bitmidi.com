exports.up = knex => {
  return knex.schema
    .createTable('midis', table => {
      table.increments('id').primary()
      table.string('name')
      table.string('hash', 64).unique()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTableIfExists('midis')
}
