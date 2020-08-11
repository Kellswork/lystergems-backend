exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('order_products')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('order_products').insert([
        { product_id: 5, order_id: 1, product_quantity: 2 },
        { product_id: 3, order_id: 1, product_quantity: 1 },
        { product_id: 10, order_id: 1, product_quantity: 1 },
        { product_id: 8, order_id: 2, product_quantity: 1 },
        { product_id: 7, order_id: 2, product_quantity: 2 },
        { product_id: 13, order_id: 2, product_quantity: 3 },
      ]);
    });
};
