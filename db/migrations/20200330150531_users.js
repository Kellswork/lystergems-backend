exports.up = function (knex) {
    knex.schema.createTable('users', (table) => {
        table.increment('id').primary()
        table.text('firstname').notNullable()
        table.text('lastname').notNullable()
        table.text('email').notNullable().unique()
        table.text('password').notNullable()
        table.foreign('user_address_id').references('user-address.id')
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users')
};