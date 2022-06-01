exports.up = function(knex) {
  return knex.schema.createTable('userlogin', table =>{
      table.increments('id').primary()
      table.string('userLogin').notNull()
      table.string('password').notNull()
      table.string('token')
      table.integer('idUser').references('id')
        .inTable('cadusers').notNull()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('userlogin')
};
