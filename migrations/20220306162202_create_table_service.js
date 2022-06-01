exports.up = function(knex) {
  return knex.schema.createTable('service', table =>{
      table.increments('id').primary()
      table.string('servico').notNull()
      table.string('desc').notNull()
      table.string('valor').notNull()
      table.string('tempoServico').notNull()
      table.string('ativo').notNull()
      table.integer('idEmpresa').references('id')
      .inTable('cadempresa').notNull()
  })
};


exports.down = function(knex) {
  return knex.schema.dropTable('service')
};
