exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users_address')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users_address').insert([
        {
          user_id: 2,
          phone_number: '012345678910',
          street_address: 'No 74 knowyourworth street',
          city: 'ikeja',
          state: 'lagos',
          country: 'nigeria',
        },
        {
          user_id: 2,
          phone_number: '10203040506',
          street_address: 'No 20 putyoufirst street',
          city: 'rumukruishi',
          state: 'PH',
          country: 'nigeria',
        },
        {
          user_id: 3,
          phone_number: '20304050607',
          street_address: 'No 40 putyoufirst street',
          city: 'rumoula',
          state: 'PH',
          country: 'nigeria',
        },
        {
          user_id: 3,
          phone_number: '20304050607',
          street_address: 'No 27 amtayado street ajaoh estate',
          city: 'oshodi',
          state: 'Lagos',
          country: 'nigeria',
        },
      ]);
    });
};
