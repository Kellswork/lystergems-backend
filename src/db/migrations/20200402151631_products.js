
exports.up = function (knex) {
    return knex.schema.createTable('products', (table) => {
        table.increments('id')
        table.integer('category_id')
            .references('id')
            .inTable('category')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.text('name').notNullable()
        table.text('image1').nullable()
        table.text('image2').nullable()
        table.text('image3').nullable()
        table.text('description').notNullable()
        table.float('quantity').defaultTo(0)
        table.boolean('availabilty').defaultTo(false)
        table.text('color').nullable()
        table.integer('price').unsigned().notNullable()
        table.integer('size').nullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('products')
};
