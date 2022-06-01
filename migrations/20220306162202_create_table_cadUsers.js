exports.up = function(knex) {
  return knex.schema.createTable('cadusers', table =>{
      table.increments('id').primary()
      table.string('nomeCompleto').notNull()
      table.string('email').notNull().unique()
      table.string('telefone').notNull()
  })
};


exports.down = function(knex) {
  return knex.schema.dropTable('cadusers')
};
