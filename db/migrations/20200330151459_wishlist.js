
exports.up = function (knex) {
    knex.schema.createTable('wishlist', (table) => {
        table.increment('id').primary()
        table.foreign('user_id').references(users.id)
        table.foreign('product_id').references(products.id)
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('ratings')
};