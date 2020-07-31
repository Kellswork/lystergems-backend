import { validationResult } from 'express-validator';

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().map((i) => i.msg),
    });
  }
  return next();
};

export const isAdmin = (user) => user.role.toLowerCase() === 'admin';

export const userIsOwner = (user, ownerId) => user.id === ownerId;

export default handleErrors;
