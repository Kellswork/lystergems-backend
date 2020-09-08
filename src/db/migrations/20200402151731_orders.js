import { updateTrigger, onUpdateTrigger } from '../../../knexfile';

export function up(knex) {
  return knex.schema
    .createTable('orders', (table) => {
      table.increments('id');
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.enu('status', ['pending', 'in_transit', 'delivered', 'cancelled']);
      table.float('shipping_fee');
      table.text('shipping_address').notNullable();
      table.timestamp('shipped_time').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').nullable();
    })
    .raw(updateTrigger())
    .raw(onUpdateTrigger('orders'));
}

export function down(knex) {
  return knex.schema.raw('drop table if exists orders cascade;');
}
