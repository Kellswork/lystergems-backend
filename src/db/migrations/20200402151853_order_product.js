exports.up = function (knex) {
    return knex.schema.createTable('order_product', (table) => {
        table.increments('id')
        table.integer('product_id')
            .references('id')
            .inTable('products')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable()
        table.integer('order_id')
            .references('id')
            .inTable('orders')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('order_product')
};
