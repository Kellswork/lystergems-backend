import Order from './order.model';

export async function createOrder(order, products) {
  // eslint-disable-next-line no-return-await
  return await Order.transaction(async (trx) => {
    const transformedProducts = products.map((prod) => {
      const product = {};
      product.product_id = prod.id;
      product.product_quantity = prod.quantity;
      return product;
    });
    const createdOrder = await trx('orders').insert({ ...order }, '*');
    transformedProducts.forEach((product) => {
      const { id } = createdOrder[0];
      // eslint-disable-next-line no-param-reassign
      product.order_id = id;
    });
    await trx('order_products').insert(transformedProducts);
    return createdOrder[0];
  });
}

export async function updateStatus(orderId, status) {
  return Order.query().patch({ status }).where({ id: orderId }).returning('*');
}

export async function getOrderByAttribute(attribute) {
  return Order.query()
    .where({ ...attribute })
    .returning('*');
}
