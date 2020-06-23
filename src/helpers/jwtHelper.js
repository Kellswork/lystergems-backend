import jwt from 'jsonwebtoken';

require('dotenv').config();

export const generateToken = (payload, value) => {
  return jwt.sign(
    {
      id: payload.id,
      firstname: payload.firstname,
      role: payload.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: value },
  );
};

export const verifyToken = (token) => {
  if (!token) return false;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    return false;
  }
};
