exports.up = knex => {
  return knex.schema
    .createTable('midis', table => {
      table.increments('id').primary()
      table.string('name')
      table.string('slug').unique().notNullable()
      table.string('hash', 64).unique()
      table.text('alternateNames')
    })
    .raw('ALTER TABLE midis ADD FULLTEXT (name)')
}

exports.down = knex => {
  return knex.schema
    .dropTableIfExists('midis')
}
