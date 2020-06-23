import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, verifyUser } from './models/index.model';
import { generateToken, verifyToken } from '../../helpers/jwtHelper';
import { hashPassword, formatResponse } from '../../helpers/baseHelper';
import sendEmailConfirmation from '../../services/email';

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
    const token = generateToken(user, '1d');
    const data = {
      user: {
        id: user.id,
        firstname,
        lastname,
        email,
      },
      token,
    };
    sendEmailConfirmation(data.user, token);
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

    verifyUser(validateToken.id);
    return formatResponse(
      res,
      { message: 'email has been verified' },
      200,
      validateToken,
    );
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'verification failed, link is no longer valid' });
  }
};

// export const ResendLink = (req, res) => {
//   sendEmailConfirmation(data.user, token);
//   try {
//     return formatResponse(res, { message: 'email link sent' }, 200);
//   } catch (error) {
//     return formatResponse(res, { message: 'could not send link' }, 500);
//   }
// };
