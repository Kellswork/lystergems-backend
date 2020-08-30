/* eslint-disable camelcase */
import { hashPassword, formatResponse } from '../../helpers/baseHelper';
import { fetchUserDetails, patchUserProfile } from './models/index.model';

export const getUserProfile = async (req, res) => {
  try {
    const profile = await fetchUserDetails(req.params.userId);
    const {
      firstname,
      lastname,
      email,
      role,
      is_verified,
      created_at,
      updated_at,
    } = profile;
    const data = {
      profile: {
        id: profile.id,
        firstname,
        lastname,
        email,
        role,
        is_verified,
        created_at,
        updated_at,
      },
    };
    return formatResponse(
      res,
      {
        message: `${[profile].length} profile found`,
      },
      200,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'could not get user profile, please try again later' },
      500,
    );
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = hashPassword(password);
    const profile = await patchUserProfile(req.params.userId, {
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    const data = {
      profile: {
        id: profile.id,
        firstname,
        lastname,
        email,
      },
    };
    return formatResponse(
      res,
      { message: 'Profile has been updated successfully' },
      200,
      data,
    );
  } catch (error) {
    console.log(error.message);
    return formatResponse(
      res,
      { error: 'could not update address, please try again later' },
      500,
    );
  }
};
