export function up(knex) {
  return knex.schema.createTable('users_address', (table) => {
    table.increments('id');
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      .notNullable();
    table.text('shipping_address').notNullable();
    table.text('city').notNullable();
    table.text('state').notNullable();
    table.text('country').notNullable();
    table.integer('zipcode').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
}

export function down(knex) {
  return knex.schema.raw('drop table if exists users_address cascade;');
}
