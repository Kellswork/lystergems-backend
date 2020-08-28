/* eslint-disable camelcase */
import { formatResponse } from '../../helpers/baseHelper';
import { fetchUserDetails } from './models/index.model';

const getUserProfile = async (req, res) => {
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

export default getUserProfile;
