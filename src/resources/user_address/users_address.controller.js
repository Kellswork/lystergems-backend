import {
  createUserAddress,
  patchUserAddress,
  fetchUserAddresses,
  fetchOneUserAddress,
  deleteOneUserAddress,
} from './model/index.model';
import { formatResponse } from '../../helpers/baseHelper';

export const addUserAddress = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const userAddress = await createUserAddress(req.body);
    const data = {
      userAddress,
    };
    return formatResponse(
      res,
      {
        message: 'Address has been added successfully',
      },
      201,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      {
        error: 'could not add address, please try again later',
      },
      500,
    );
  }
};

export const updateUserAddress = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;

  try {
    const userAddress = await patchUserAddress(req.params.addressId, req.body);
    const data = {
      userAddress,
    };
    return formatResponse(
      res,
      { message: 'Address has been updated successfully' },
      200,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'could not update address, please try again later' },
      500,
    );
  }
};

export const getUserAddresses = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const userAddress = await fetchUserAddresses(req.params.userId);
    const data = {
      userAddress,
    };
    return formatResponse(
      res,
      {
        message: `${userAddress.length} found`,
      },
      200,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'could not get addresses, please try again later' },
      500,
    );
  }
};

export const getOneUserAddress = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const userAddress = await fetchOneUserAddress(
      req.params.userId,
      req.params.addressId,
    );
    const data = {
      userAddress,
    };
    return formatResponse(
      res,
      { message: 'address fetched successfully' },
      200,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'could not get addresses, please try again later' },
      500,
    );
  }
};

export const deleteUserAddress = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const userAddress = await deleteOneUserAddress(
      req.params.userId,
      req.params.addressId,
    );
    const data = {
      userAddress,
    };
    return formatResponse(
      res,
      { message: 'address deleted successfully' },
      200,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'could not get addresses, please try again later' },
      500,
    );
  }
};
