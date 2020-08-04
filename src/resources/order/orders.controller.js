/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable camelcase */
import {
  createOrder,
  updateStatus,
  getOrderWithProducts,
  formatOrderFromResponse,
  getProducts,
  updateShippedOrDeliveredTime,
  fetchOrders,
  formatAllOrdersResponse,
} from './models/index.model';
import { formatResponse, pagination } from '../../helpers/baseHelper';

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
  const { id, status } = req;
  const columns = {
    in_transit: 'shipped_time',
    delivered: 'delivered_at',
  };

  try {
    if (status === 'in_transit' || status === 'delivered') {
      await updateShippedOrDeliveredTime(id, columns[status]);
    }
    const response = await updateStatus(id, status);
    return formatResponse(
      res,
      { message: 'Order status successfully updated' },
      200,
      { order: response[0] },
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Cannot update order at the moment, try again later' },
      500,
    );
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await getOrderWithProducts(id);
    const order = formatOrderFromResponse(response.rows[0]);
    order.products = getProducts(response.rows);
    const data = {
      order,
    };
    return formatResponse(
      res,
      { message: 'Order fetched successfully' },
      200,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Cannot fetch order at the moment, try again later' },
      500,
    );
  }
};

export const cancelOrder = async (req, res) => {
  const {
    order: { id },
  } = req;
  try {
    const response = await updateStatus(id, 'cancelled');
    return formatResponse(
      res,
      { message: 'Order status successfully cancelled' },
      200,
      { order: response[0] },
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Cannot cancel order at the moment, try again later' },
      500,
    );
  }
};

export const getAllOrders = async (req, res) => {
  try {
    let { page, pageSize } = req.query;
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;

    const orders = await fetchOrders(page - 1, pageSize);
    const ordersFormat = formatAllOrdersResponse(orders.results);
    const { previousPage, nextPage } = pagination(page, pageSize, orders);
    const data = {
      previousPage,
      nextPage,
      orders: ordersFormat,
    };
    return formatResponse(
      res,
      { message: `${orders.total} Orders found` },
      200,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Cannot get orders at the moment, try again later' },
      500,
    );
  }
};
