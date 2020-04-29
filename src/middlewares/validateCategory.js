import { body, check, validationResult } from 'express-validator';
import { getCategoryByName } from '../resources/category/models/index.model';

const validateCategory = [
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
      const response = await getCategoryByName(value.toLowerCase());
      if (response.length) {
        throw new Error('A category with this name already exists');
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

export default validateCategory;
