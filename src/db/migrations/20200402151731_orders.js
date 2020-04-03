
exports.up = function (knex) {
    return knex.schema.createTable('orders', (table) => {
        table.increments('id')
        table.integer('user_id')
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.enu('status', ['pending', 'in_transit', 'delivered', 'cancelled'])
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
    })
};

exports.down = function (knex) {
    return knex.schema.raw('drop table if exists orders cascade;');
};
