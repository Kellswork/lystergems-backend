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

export const checkUserId = (req, res, next) => {
  const { id } = req.user;
  req.body.user_id = id;
  if (req.user.id != req.params.userId)
    return res
      .status(401)
      .json({ error: "You cannot access a resource you didn't create" });
  return next();
};

export default handleErrors;
