import { createUser, getUserByEmail } from './models/index.model';
import generateToken from '../../helpers/generateToken';
import {
  hashPassword,
  validatePassword,
  formatResponse,
} from '../../helpers/baseHelper';

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
    return res.status(201).json({
      message: 'user created successfully',
      user: {
        id: user.id,
        firstname,
        lastname,
        email,
      },
      token,
    });
  } catch (error) {
    if (
      error.name == 'UniqueViolationError' &&
      error.columns.includes('email')
    ) {
      return res.status(400).json({
        error: 'email has already been registered',
      });
    }
    return res.status(500).json({
      error: 'could not create user, please try again later',
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const dbUser = await getUserByEmail(email);
    if (!dbUser[0]) {
      return res.status(404).json({ message: 'Invalid Email/Password' });
    }

    if (!validatePassword(password, dbUser[0].password)) {
      return res.status(404).json({ message: 'Invalid Email/Password' });
    }

    const user = { ...dbUser[0] };
    delete user.password;
    const token = generateToken(user);

    const data = {
      user: { ...user },
      token,
    };
    return formatResponse(res, 'Login successful', 200, data);
  } catch (error) {
    return formatResponse(
      res,
      'Unable to login at the moment, please try again later',
      500,
      { error },
    );
  }
};

export default addUserInfo;
