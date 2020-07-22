import { check, validationResult } from 'express-validator';

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().map((i) => i.msg),
    });
  }
  return next();
};

const validateOrder = [
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

export default validateOrder;
