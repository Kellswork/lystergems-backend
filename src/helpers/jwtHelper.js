import jwt from 'jsonwebtoken';

require('dotenv').config();

export const generateToken = (payload) => {
  return jwt.sign(
    {
      id: payload.id,
      firtsname: payload.firstname,
      role: payload.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
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
