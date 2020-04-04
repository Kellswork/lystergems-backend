export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.text('firstname').notNullable();
    table.text('lastname').notNullable();
    table.text('email').notNullable().unique().comment('email must be unique');
    table.text('password').notNullable();
    table.text('phone_number').notNullable();
    table.enu('role', ['customer', 'admin']).defaultTo('customer');
    table.boolean('is_verified').defaultTo(false).comment('email verification');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
}

export function down(knex) {
  return knex.schema.raw('drop table if exists users cascade;');
}
