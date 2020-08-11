import { hashPassword } from '../../../helpers/baseHelper';

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          firstname: 'admin',
          lastname: 'admin',
          email: 'admin@shoppingsite.com',
          password: hashPassword('admin'),
          role: 'admin',
        },
        {
          firstname: 'kelly',
          lastname: 'ogbonna',
          email: 'kellyobi@gmail.com',
          password: hashPassword('12345'),
        },
        {
          firstname: 'Kev',
          lastname: 'omenkish',
          email: 'kev@gmail.com',
          password: hashPassword('12345'),
        },
      ]);
    });
};
