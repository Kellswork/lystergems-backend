import { check } from 'express-validator';
import handleErrors from './baseMiddleware';

const validateUserAddress = [
  check('user_id')
    .isNumeric()
    .withMessage('user id is not valid')
    .isLength({ min: 1 })
    .withMessage('please add a user id')
    .trim(),

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
    .isLength({ max: 50 })
    .trim(),

  check('city')
    .isLength({ min: 1 })
    .withMessage('please add your city')
    .isAlpha()
    .withMessage('please add a valid city')
    .isLength({ max: 50 })
    .withMessage('maximum length of characters reached'),

  check('state')
    .isLength({ min: 1 })
    .withMessage('please add your state')
    .isAlpha()
    .withMessage('please add a valid state')
    .isLength({ max: 50 })
    .trim(),

  check('country')
    .isLength({ min: 1 })
    .withMessage('please add your country')
    .isAlpha()
    .withMessage('please add your country')
    .isLength({ max: 50 })
    .trim(),

  (req, res, next) => handleErrors(req, res, next),
];

export default validateUserAddress;
