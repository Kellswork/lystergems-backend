import { check } from 'express-validator';
import handleErrors from './baseMiddleware';
import { getItemByAttribute, formatResponse } from '../helpers/baseHelper';

export const validateUserAddress = [
  check('phone_number')
    .isLength({
      min: 1,
    })
    .withMessage('please input a valid phone number')
    .isLength({
      max: 15,
    })
    .withMessage('maximum length of phone number reached')
    .trim(),

  check('street_address')
    .isLength({ min: 1 })
    .withMessage('street address cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Street address should be at most 100 characters')
    .trim(),

  check('city')
    .isLength({ min: 1 })
    .withMessage('City cannot be empty')
    .isLength({ max: 50 })
    .withMessage('maximum length of characters reached'),

  check('state')
    .isLength({ min: 1 })
    .withMessage('State cannot be empty')
    .isLength({ max: 50 })
    .withMessage('State cannot exceed 50 characters')
    .trim(),

  check('country')
    .isLength({ min: 1 })
    .withMessage('Country cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters')
    .trim(),

  (req, res, next) => handleErrors(req, res, next),
];

export const checkIfUserAddressExists = async (req, res, next) => {
  const { id } = req.user;
  try {
    const dbOrder = await getItemByAttribute('users_address', 'user_id', id);
    if (dbOrder.rows.length) {
      return formatResponse(res, { error: 'You already have an address' }, 400);
    }
    return next();
  } catch (error) {
    return formatResponse(res, { error: 'An error occurred' }, 500);
  }
};
