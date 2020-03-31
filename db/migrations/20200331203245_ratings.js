exports.up = function (knex) {
    return knex.schema.createTable('ratings', (table) => {
        table.increments('id')
         table.integer('user_id')
             .references('id')
             .inTable('users')
             .onUpdate('CASCADE')
             .onDelete('CASCADE')
             .nullable()
         table.uuid('product_id')
             .references('id')
             .inTable('products')
             .onUpdate('CASCADE')
             .onDelete('CASCADE')
             .notNullable()
        table.uuid('order_id')
            .references('id')
            .inTable('orders')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable()
        table.integer('count').unsigned()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('ratings')
};

