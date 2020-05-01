const hashPassword = require('../../../helpers/baseHelper');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('table_name')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          firstname: 'admin',
          lastname: 'admin',
          email: 'admin@shoppingsite.com',
          password: hashPassword('admin'),
        },
      ]);
    });
};
