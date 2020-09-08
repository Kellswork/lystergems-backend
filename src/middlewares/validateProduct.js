import { body, check } from 'express-validator';
import { formatResponse, getItemByAttribute } from '../helpers/baseHelper';
import handleErrors from './baseMiddleware';

export const validateProduct = [
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
  (req, res, next) => handleErrors(req, res, next),
];

export const validateNameUniqueness = [
  body('name').custom(async (value) => {
    try {
      const response = await getItemByAttribute(
        'products',
        'name',
        value.toLowerCase(),
      );
      if (response.rows.length) {
        throw new Error('A product with this name already exists');
      }
    } catch (error) {
      throw new Error(error);
    }
  }),
  (req, res, next) => handleErrors(req, res, next),
];

export const checkIfProductExists = async (req, res, next) => {
  const { id } = req.params;
  try {
    const dbProduct = await getItemByAttribute('products', 'id', id);
    if (!dbProduct.rows.length) {
      return formatResponse(
        res,
        { message: 'No product found with this id' },
        200,
      );
    }
  } catch (error) {
    return formatResponse(res, { error: 'An error occurred' }, 500);
  }
  return next();
};
