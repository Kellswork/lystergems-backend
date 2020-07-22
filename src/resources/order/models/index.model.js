import Order from './order.model';

async function createOrder(order) {
  return Order.query().insert(order).returning('*');
}

export default createOrder;
