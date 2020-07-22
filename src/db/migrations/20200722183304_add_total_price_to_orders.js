export function up(knex) {
  return knex.schema.table('orders', (table) => {
    table.float('total_price').notNullable();
  });
}

export function down(knex) {
  return knex.schema.table('orders', (table) => {
    table.dropColumn('total_price');
  });
}
