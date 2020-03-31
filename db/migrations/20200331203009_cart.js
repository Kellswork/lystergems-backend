exports.up = function (knex) {
    return knex.schema.createTable('cart', (table) => {
        table.uuid('id').primary().notNullable()
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
        table.text('total_price').defaultTo(0).nullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('cart')
};


