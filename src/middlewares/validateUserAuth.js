import { verifyToken } from '../helpers/jwtHelper';
import { formatResponse } from '../helpers/baseHelper';

export const verifyAuth = (req, res, next) => {
  const token = req.header('x-auth-token');
  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return formatResponse(
      res,
      { error: 'Access denied. You are not authorized to access this route' },
      401,
    );
  }

  req.user = decodedToken;
  return next();
};

export const validateAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'admin') {
    return formatResponse(
      res,
      { error: 'You are not authorized to perform this action' },
      403,
    );
  }
  return next();
};
