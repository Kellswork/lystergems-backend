import { check } from 'express-validator';
import handleErrors from './baseMiddleware';

const validateWishlist = [
  check('product_id')
    .isLength({
      min: 1,
    })
    .withMessage('please input a product id')
    .isInt()
    .withMessage('product id has to be a number')
    .trim(),

  (req, res, next) => handleErrors(req, res, next),
];

export default validateWishlist;
