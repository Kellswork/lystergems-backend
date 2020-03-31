exports.up = function (knex) {
    knex.schema.createTable('orders', (table) => {
        table.uuid('id').primary().notNullable()
        table.foreign('user_id').references(users.id)
        table.foreign('product_id').references(products.id)
        table.text('status').defaultTo('pending').notNullable()
        table.text('total_price').defaultTo(0)
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('orders')

};