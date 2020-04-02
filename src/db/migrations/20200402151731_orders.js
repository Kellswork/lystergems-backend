
exports.up = function (knex) {
    return knex.schema.createTable('orders', (table) => {
        table.increments('id')
        table.integer('user_id')
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.integer('product_id')
            .references('id')
            .inTable('products')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.enu('status', ['pending', 'in_transit', 'delivered', 'cancelled'])
        table.text('total_price').defaultTo(0)
        table.integer('product_quantity').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('orders')
};
