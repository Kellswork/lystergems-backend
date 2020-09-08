/* eslint-disable camelcase */
import { check } from 'express-validator';
import handleErrors, { userIsOwner, isAdmin } from './baseMiddleware';
import { STATUSES } from '../resources/order/models/order.model';
import { formatResponse, getItemByAttribute } from '../helpers/baseHelper';

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
    return next();
  }

  return formatResponse(res, { error: 'Status is not valid' }, 400);
};

const isOperationValid = (orderStatus, newStatus) => {
  if (
    (orderStatus === 'pending' && newStatus !== 'in_transit') ||
    (orderStatus === 'in_transit' && newStatus !== 'delivered')
  )
    return false;

  return true;
};

export const checkIfOrderExists = async (req, res, next) => {
  const { id } = req.params;
  try {
    const dbOrder = await getItemByAttribute('orders', 'id', id);
    if (!dbOrder.rows.length) {
      return formatResponse(res, { message: 'Order not found' }, 404);
    }
    // eslint-disable-next-line prefer-destructuring
    req.order = dbOrder.rows[0];
    return next();
  } catch (error) {
    return formatResponse(res, { error: 'An error occurred' }, 500);
  }
};

export const restrictAccessToOwnerAndAdmin = (req, res, next) => {
  const {
    user,
    order: { user_id },
  } = req;

  if (userIsOwner(user, user_id) || isAdmin(user)) return next();

  return formatResponse(
    res,
    { error: 'You are not allowed to access this order' },
    401,
  );
};

export const validateStatusUpdate = async (req, res, next) => {
  const { order } = req;
  const newStatus = req.body.status;

  const { status } = order;

  if (status === 'cancelled' || status === 'delivered') {
    return formatResponse(
      res,
      { message: `Cannot update a ${status} order` },
      400,
    );
  }

  if (!isOperationValid(status, newStatus)) {
    return formatResponse(
      res,
      {
        message: `The status of this order cannot be updated to ${newStatus}`,
      },
      400,
    );
  }

  req.id = order.id;
  req.status = newStatus;

  return next();
};

export const checkIfUserIsOwner = (req, res, next) => {
  if (userIsOwner(req.user, req.order.user_id)) return next();

  return formatResponse(
    res,
    { error: 'Only the owner can cancel an order' },
    400,
  );
};

export const allowOnlyPendingOrder = (req, res, next) => {
  if (req.order.status === 'pending') return next();

  return formatResponse(
    res,
    { error: 'Only pending orders can be cancelled' },
    400,
  );
};
