import jwt from 'jsonwebtoken';

require('dotenv').config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      firtsname: user.firstname,
    },
    'secrete',
    { expiresIn: '1d' },
  );
}

module.exports = generateToken;
