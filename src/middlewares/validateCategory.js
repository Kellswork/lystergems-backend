import { body, check } from 'express-validator';
import { getCategoryByAttribute } from '../resources/category/models/index.model';
import { formatResponse, handleErrors} from '../helpers/baseHelper';

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
      const response = await getCategoryByAttribute({
        name: value.toLowerCase(),
      });
      if (response.length) {
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
    const dbCategory = await getCategoryByAttribute({ id });
    if (!dbCategory.length) {
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
