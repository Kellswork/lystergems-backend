import jwt from 'jsonwebtoken';

require('dotenv').config();

function generateToken(payload) {
  return jwt.sign(
    {
      id: payload.id,
      firtsname: payload.firstname,
      role: payload.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
}

module.exports = generateToken;
