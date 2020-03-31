exports.up = function (knex) {
    return knex.schema.createTable('wishlist', (table) => {
        table.increments('id').primary()
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
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('wishlist')
};
