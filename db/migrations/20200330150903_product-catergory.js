exports.up = function (knex) {
    knex.schema.createTable('product-catergory', (table) => {
        table.increment('id')
        table.text('category_name').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })

};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('product-category')
};