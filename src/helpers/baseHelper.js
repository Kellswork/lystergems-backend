import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

export const validatePassword = (newPassword, dbPassword) => {
  return bcrypt.compareSync(newPassword, dbPassword);
};

export const formatResponse = (res, responseMessage, statusCode, data) => {
  let response = res;
  if (data.token) {
    response = res.header('x-auth-token', data.token);
  }
  return response.status(statusCode).json({
    message: responseMessage,
    data: { ...data },
  });
};
