/* eslint-disable camelcase */
import { formatResponse } from '../../helpers/baseHelper';
import { fetchUserDetails, patchUserProfile } from './models/index.model';

export const getUserProfile = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
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
      id: profile.id,
      firstname,
      lastname,
      email,
      role,
      is_verified,
      created_at,
      updated_at,
    };
    return formatResponse(
      res,
      {
        message: `${profile.length} profile found`,
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
    const profile = await patchUserProfile(req.params.userId, req.body);
    const data = {
      profile,
    };
    return formatResponse(
      res,
      { message: 'Profile has been updated successfully' },
      200,
      data,
    );
  } catch (error) {
    console.log(error);
    return formatResponse(
      res,
      { error: 'could not update address, please try again later' },
      500,
    );
  }
};
