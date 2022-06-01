
exports.up = function(knex) {
  return knex.schema.createTable('empresalogin', table =>{
      table.increments('id').primary()
      table.string('empresaLogin').notNull()
      table.string('password').notNull()
      table.string('token')
      table.integer('idEmpresa').references('id')
        .inTable('cadempresa').notNull()
  })
};


exports.down = function(knex) { 
    return knex.schema.dropTable('empresalogin')
};
