import Order from './order.model';
import db from '../../../db/dbconfig';

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

export async function getOrderWithProducts(orderId) {
  return db.raw(
    `SELECT o.*, p.id AS product_id, p.name AS name,
      p.description AS description, p.image1 AS image1,
      p.image2 AS image2, p.image3 AS image3, p.color AS color,
      p.price AS price, p.size AS size FROM orders AS o INNER JOIN order_products AS op ON o.id = op.order_id INNER JOIN products AS p ON op.product_id = p.id  WHERE o.id = ?`,
    [orderId],
  );
}

export function formatOrderFromResponse(response) {
  return {
    id: response.id,
    user_id: response.user_id,
    status: response.status,
    shipping_address: response.shipping_address,
    shipped_time: response.shipped_time,
    total_time: response.total_time,
    shipping_fee: response.shipping_fee,
    created_at: response.created_at,
    updated_at: response.updated_at,
  };
}

export function getProducts(response) {
  return response.map((prod) => {
    const product = {};
    product.id = prod.product_id;
    product.name = prod.name;
    product.description = prod.description;
    product.image1 = prod.image1;
    product.image2 = prod.image2;
    product.image3 = prod.image3;
    product.color = prod.color;
    product.price = prod.price;
    product.size = prod.size;

    return product;
  });
}
