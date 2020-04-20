import jwt from 'jsonwebtoken';

require('dotenv').config();

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      firtsname: user.firstname,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
