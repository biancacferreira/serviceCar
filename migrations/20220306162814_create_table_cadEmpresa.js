exports.up = function(knex) {
  return knex.schema.createTable('cadempresa', table =>{
      table.increments('id').primary()
      table.string('nomeEmpresa')
      table.string('cnpj').notNull().unique()
      table.string('telefone')
      table.string('cidade')
      table.string('bairro')            
      table.string('rua')      
      table.string('especialidade').notNull()
      table.string('email').notNull().unique()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('cadempresa')
};
