import createOrder from './models/index.model';
import { formatResponse } from '../../helpers/baseHelper';

const addOrder = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const order = await createOrder(req.body);

    return formatResponse(
      res,
      { message: 'Order created successfully' },
      201,
      order,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'could not create order, please try again later' },
      500,
    );
  }
};

export default addOrder;
