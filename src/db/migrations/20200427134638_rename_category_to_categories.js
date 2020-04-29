export function up(knex) {
  return knex.schema.renameTable('category', 'categories');
}

export function down(knex) {
  return knex.schema.raw('drop table if exists categories cascade;');
}
