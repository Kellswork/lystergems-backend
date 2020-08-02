import { body, check } from 'express-validator';
import { formatResponse, getItemByAttribute } from '../helpers/baseHelper';
import handleErrors from './baseMiddleware';

export const validateCategory = [
  check('name')
    .matches(/^[a-zA-Z ]+$/i)
    .withMessage('Name must contain only alphabets')
    .isLength({
      min: 3,
    })
    .withMessage('Category name must be at least 3 characters long')
    .isLength({
      max: 50,
    })
    .withMessage('Category name cannot be more than 50 characters')
    .trim(),
  body('name').custom(async (value) => {
    try {
      const response = await getItemByAttribute(
        'categories',
        'name',
        value.toLowerCase(),
      );
      if (response.rows.length) {
        throw new Error('A category with this name already exists');
      }
    } catch (error) {
      throw new Error(error);
    }
  }),
  (req, res, next) => handleErrors(req, res, next),
];

export const checkIfCategoryExists = async (req, res, next) => {
  const { id } = req.params;
  try {
    const dbCategory = await getItemByAttribute('categories', 'id', id);
    if (!dbCategory.rows.length) {
      return formatResponse(
        res,
        { message: 'No category found with this id' },
        200,
      );
    }
  } catch (error) {
    return formatResponse(res, { error: 'An error occurred' }, 500);
  }
  return next();
};
