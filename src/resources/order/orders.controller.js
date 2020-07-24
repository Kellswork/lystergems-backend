/* eslint-disable camelcase */
import { createOrder, updateStatus } from './models/index.model';
import { formatResponse } from '../../helpers/baseHelper';

export const addOrder = async (req, res) => {
  const { id } = req.user;
  const { shipping_address, shipping_fee, total_price, products } = req.body;

  const order = {
    user_id: id,
    shipping_address,
    shipping_fee,
    total_price,
  };

  try {
    const orderResponse = await createOrder(order, products);
    return formatResponse(res, { message: 'Order created successfully' }, 201, {
      order: orderResponse,
    });
  } catch (error) {
    if (error.constraint === 'order_products_product_id_foreign') {
      return formatResponse(res, { error: 'Products Ids do not exist' }, 500);
    }
    return formatResponse(
      res,
      { error: 'could not create order, please try again later' },
      500,
    );
  }
};

export const updateOrder = async (req, res) => {
  const { id, status } = req.body;
  try {
    const response = await updateStatus(id, status);
    return formatResponse(
      res,
      { message: 'Order status successfully updated' },
      200,
      { order: response[0] },
    );
  } catch (e) {
    return formatResponse(
      res,
      { error: 'Cannot update order at the moment, try again later' },
      500,
    );
  }
};
