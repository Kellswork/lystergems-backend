import createOrder from './models/index.model';
import { formatResponse } from '../../helpers/baseHelper';

const create = async (req, res) => {
  const { id } = req.user;
  const { order, products } = req.body;
  req.body.user_id = id;
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

export default create;
