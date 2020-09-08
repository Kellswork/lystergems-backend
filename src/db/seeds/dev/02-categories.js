exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('categories')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('categories').insert([
        { name: 'wedding rings' },
        { name: 'necklaces' },
        { name: 'knuckle rings' },
        { name: 'alté glasses' },
      ]);
    });
};
