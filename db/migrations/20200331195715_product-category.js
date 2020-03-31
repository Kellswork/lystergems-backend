
exports.up = function (knex) {
    return knex.schema.createTable('product-category', (table) => {
        table.increments('id')
        table.text('category_name').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('product-category')
};
