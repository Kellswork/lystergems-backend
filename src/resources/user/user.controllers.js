import {
  fetchUserOrders,
  formatAllOrdersResponse,
} from '../order/models/index.model';
import { pagination, formatResponse } from '../../helpers/baseHelper';

const getUserOrders = async (req, res) => {
  try {
    let { page, pageSize } = req.query;
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;

    const orders = await fetchUserOrders(page - 1, pageSize, req.params.userId);
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

export default getUserOrders;
