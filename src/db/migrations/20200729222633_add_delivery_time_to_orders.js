export function up(knex) {
  return knex.schema.table('orders', (table) => {
    table.timestamp('delivered_at').nullable();
  });
}

export function down(knex) {
  return knex.schema.table('orders', (table) => {
    table.dropColumn('delivered_at');
  });
}
