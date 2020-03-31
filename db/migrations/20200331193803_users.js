exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.text('firstname').notNullable()
        table.text('lastname').notNullable()
        table.text('email').notNullable().unique().comment('email must be unique')
        table.text('password').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    });
}

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users')
};