import { check } from 'express-validator';
import handleErrors from './baseMiddleware';
import { STATUSES } from '../resources/order/models/order.model';
import { formatResponse } from '../helpers/baseHelper';
import { getOrderByAttribute } from '../resources/order/models/index.model';

export const validateOrder = [
  check('shipping_address')
    .isLength({ min: 1 })
    .withMessage('Please input the shipping address')
    .isLength({
      min: 3,
    })
    .withMessage('Address must be at least 3 characters')
    .isLength({
      max: 200,
    })
    .withMessage('Address cannot be more than 200 characters')
    .trim(),
  check('shipping_fee')
    .isFloat()
    .withMessage('Shipping fee must be a float number')
    .isLength({ min: 1 })
    .withMessage('Please input the shipping fee')
    .trim(),
  check('total_price')
    .isFloat()
    .withMessage('Total price must be a float number')
    .isLength({ min: 1 })
    .withMessage('Please input the total price')
    .trim(),
  (req, res, next) => handleErrors(req, res, next),
];

export const checkStatus = (req, res, next) => {
  const { status } = req.body;

  if (STATUSES.includes(status)) {
    return formatResponse(res, { error: 'Status is not valid' }, 400);
  }

  return next();
};

const isOperationValid = (orderStatus, newStatus) => {
  if (
    (orderStatus === 'pending' && newStatus !== 'on_transit') ||
    (orderStatus === 'in_transit' && newStatus !== 'delivered')
  )
    return false;

  return true;
};

export const validateStatusUpdate = (req, res, next) => {
  const { id } = req.params;
  const newStatus = req.body.status;

  const getOrder = getOrderByAttribute({ id });
  if (!getOrder) {
    return formatResponse(res, { message: 'Order not found' }, 404);
  }

  const { status } = getOrder[0];

  if (status === 'cancelled') {
    return formatResponse(
      res,
      { message: 'Cannot update a cancelled order' },
      400,
    );
  }

  if (!isOperationValid(status, newStatus)) {
    return formatResponse(
      res,
      { message: `The status of this order cannot be updated to ${newStatus}` },
      400,
    );
  }

  req.id = getOrder[0].id;
  req.status = newStatus;

  return next();
};
