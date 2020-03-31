exports.up = function (knex) {
    return knex.schema.createTable('users-address', (table) => {
        table.increments('id')
        table.integer('user_id')
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.text('billing_address').notNullable()
        table.text('shipping_address').notNullable()
        table.text('city').notNullable()
        table.text('state').notNullable()
        table.text('country').notNullable()
        table.integer('zipcode').unsigned()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();

    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users-address')
};