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

export default handleErrors;
