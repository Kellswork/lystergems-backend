import { body, check, validationResult } from 'express-validator';
import { getProductName } from '../resources/product/models/index.models';

const validateProduct = [
  check('name')
    .matches(/^[a-zA-Z ]+$/i)
    .withMessage('Product name must contain only alphabets')
    .isLength({
      min: 3,
    })
    .withMessage('Product name must be at least 3 characters long')
    .isLength({
      max: 50,
    })
    .withMessage('Product name cannot be more than 50 characters')
    .trim(),
  check('description')
    .isLength({
      min: 5,
    })
    .withMessage('Product description must be at least 3 characters long')
    .isLength({
      max: 250,
    })
    .withMessage('Product description cannot be more than 50 characters')
    .trim(),
  check('price')
    .isFloat()
    .withMessage('price must be float numbers')
    .isLength({ min: 1 })
    .withMessage('please input the product price')
    .trim(),
  check('quantity')
    .isNumeric()
    .withMessage('please input a valid number')
    .isLength({ min: 1 })
    .withMessage('please add product quantity')
    .trim(),

  body('name').custom(async (value) => {
    try {
      const response = await getProductName(value.toLowerCase());
      if (response.length) {
        throw new Error('A product with this name already exists');
      }
    } catch (error) {
      throw new Error(error);
    }
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array().map((i) => i.msg),
      });
    }
    return next();
  },
];

export default validateProduct;
