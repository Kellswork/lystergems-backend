import bcrypt from 'bcryptjs';
import { createUser, createUserAddress } from './models/index.model';

export const addUserInfo = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: 'user created successfully',
      user: {
        id: user.id,
        firstname,
        lastname,
        email,
      },
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

export const addUserAddressInfo = async (req, res) => {
  try {
    const userAddress = await createUserAddress(req.body);
    return res.status(201).json({
      message: 'address has been added successfully',
      userAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'could not add address, please try again later',
    });
  }
};
