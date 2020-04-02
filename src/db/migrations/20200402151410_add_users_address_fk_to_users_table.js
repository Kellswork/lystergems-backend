exports.up = function (knex) {
    return knex.schema.alterTable('users', (table) => {
        table.integer('address_id')
            .references('id')
            .inTable('users_address')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })
};

exports.down = function (knex) {
    return knex.schema.raw('drop table if exists users cascade;');
};
