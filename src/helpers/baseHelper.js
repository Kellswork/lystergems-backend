import bcrypt from 'bcryptjs';
import db from '../db/dbconfig';

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

export const formatResponse = (res, responseMessage, statusCode, data) => {
  let response = res;
  if (data && data.token) {
    response = res.header('x-auth-token', data.token);
  }
  return response.status(statusCode).json({
    ...responseMessage,
    ...data,
  });
};

export const getItemByAttribute = (model, attribute, attributeValue) => {
  return db.raw(
    `SELECT * FROM ${model} WHERE ${attribute} = '${attributeValue}'`,
  );
};
export const pagination = (page, pageSize, orders) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const obj = {};
  if (startIndex > 0) obj.previousPage = page - 1;
  if (endIndex < orders.total) obj.nextPage = page + 1;
  return obj;
};
