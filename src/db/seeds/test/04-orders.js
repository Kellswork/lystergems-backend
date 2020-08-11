exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('orders')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('orders').insert([
        {
          user_id: 2,
          shipping_address: '74 olateju street mushin lagos',
          shipping_fee: 1000,
          total_price: 24000,
        },
        {
          user_id: 3,
          shipping_address: '75 ajaoh estate lagos',
          shipping_fee: 1000,
          total_price: 26000,
        },
      ]);
    });
};
