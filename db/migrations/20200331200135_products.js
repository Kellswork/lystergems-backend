exports.up = function (knex) {
    return knex.schema.createTable('products', (table) => {
        table.uuid('id').primary()
        table.integer('product_category_id')
            .references('id')
            .inTable('product-category')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.text('product_name').notNullable()
        table.text('product_image1').nullable()
        table.text('product_image2').nullable()
        table.text('product_image3').nullable()
        table.text('product_description').notNullable()
        table.float('product_quantity').defaultTo(0)
        table.boolean('product_availabilty').defaultTo(false)
        table.text('product_color').nullable()
        table.integer('product_price').unsigned().notNullable()
        table.text('product_size').nullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('products')
};