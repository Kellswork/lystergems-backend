import { updateTrigger, onUpdateTrigger } from '../../../knexfile';

export function up(knex) {
  return knex.schema
    .createTable('products', (table) => {
      table.increments('id');
      table
        .integer('category_id')
        .references('id')
        .inTable('category')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable();
      table.text('name').notNullable();
      table.text('image1').nullable();
      table.text('image2').nullable();
      table.text('image3').nullable();
      table.text('description').notNullable();
      table.integer('quantity').defaultTo(0);
      table.boolean('is_available').defaultTo(false);
      table.text('color').nullable();
      table.float('price').unsigned().notNullable();
      table.text('size').defaultTo('N/A');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.dateTime('updated_at').nullable();
    })
    .raw(updateTrigger())
    .raw(onUpdateTrigger('products'));
}

export function down(knex) {
  return knex.schema.raw('drop table if exists products cascade;');
}
