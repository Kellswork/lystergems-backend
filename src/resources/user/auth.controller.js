import bcrypt from 'bcryptjs';
import {
  createUser,
  getUserByEmail,
  verifyUser,
  updateUserPassword,
} from './models/index.model';
import { generateToken, verifyToken } from '../../helpers/jwtHelper';
import { hashPassword, formatResponse } from '../../helpers/baseHelper';
import sendEmail from '../../services/email';

export const addUserInfo = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = hashPassword(password);
    const user = await createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user);
    const data = {
      user: {
        id: user.id,
        firstname,
        lastname,
        email,
      },
      token,
    };

    await sendEmail(user, token);
    return formatResponse(
      res,
      { message: 'user created successfully' },
      201,
      data,
    );
  } catch (error) {
    if (
      error.name == 'UniqueViolationError' &&
      error.columns.includes('email')
    ) {
      return formatResponse(
        res,
        { error: 'email has already been registered' },
        400,
      );
    }
    return formatResponse(
      res,
      { error: 'could not create user, please try again later' },
      500,
    );
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const dbUser = await getUserByEmail(email);
    if (!dbUser[0]) {
      return res.status(400).json({ error: 'Invalid Email/Password' });
    }

    if (!bcrypt.compareSync(password, dbUser[0].password)) {
      return res.status(400).json({ error: 'Invalid Email/Password' });
    }

    const user = { ...dbUser[0] };
    delete user.password;
    const token = generateToken(user);

    const data = {
      user: { ...user },
      token,
    };
    return formatResponse(res, { message: 'Login successful' }, 200, data);
  } catch (error) {
    return formatResponse(
      res,
      { error: 'Unable to login at the moment, please try again later' },
      500,
      { error },
    );
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const validateToken = verifyToken(token);

    await verifyUser(validateToken.id);
    return formatResponse(
      res,
      { message: 'email has been verified' },
      202,
      validateToken,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'verification failed, link is no longer valid' },
      500,
    );
  }
};

export const resetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;
    const dbUser = await getUserByEmail(email);
    if (!dbUser[0]) return formatResponse(res, { error: 'Invalid Email' }, 404);

    const { id, firstname, lastname } = dbUser[0];
    const user = {
      id,
      firstname,
      lastname,
      email,
    };

    const token = generateToken(user);
    const result = await sendEmail(user, token, true);
    if (result == 'message sent')
      return formatResponse(res, { message: 'ResetPassword Link Sent!' }, 200);
  } catch (error) {
    return formatResponse(
      res,
      { error: 'unable to send message at the moment' },
      500,
      { error },
    );
  }
};

export const newPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const payload = verifyToken(token);
    if (!payload)
      return formatResponse(
        res,
        { message: 'Password token link is invalid or has expired' },
        401,
      );
    const { password } = req.body;
    const hashedPassword = hashPassword(password);
    await updateUserPassword(payload.id, hashedPassword);

    return formatResponse(
      res,
      { message: 'Password has been updated succesfully' },
      202,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'unable to send message at the moment' },
      500,
      { error },
    );
  }
};
