exports.up = function (knex) {
    knex.schema.createTable('ratings', (table) => {
        table.increment('id').primary()
        table.foreign('user_id').references(users.id).nullable()
        table.foreign('product_id').references(products.id)
        table.foreign('order_id').references(orders.id)
        table.integer('count').unsigned()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('ratings')
};