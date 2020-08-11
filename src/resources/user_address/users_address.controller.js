import {
  createUserAddress,
  patchUserAddress,
  fetchUserAddresses,
  fetchOneUserAddress,
  deleteOneUserAddress,
} from './model/index.model';

export const addUserAddress = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const userAddress = await createUserAddress(req.body);
    return res.status(201).json({
      message: 'Address has been added successfully',
      userAddress,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'could not add address, please try again later',
    });
  }
};

export const updateUserAddress = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;

  try {
    if (req.user.id != req.params.userId)
      // change this after creating get all and get one
      return res
        .status(401)
        .json({ message: "You cannot access an address you didn't create" });

    const userAddress = await patchUserAddress(req.params.addressId, req.body);
    return res.status(200).json({
      message: 'Address has been updated successfully',
      userAddress,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'could not update address, please try again later',
    });
  }
};

export const getUserAddresses = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;

  try {
    if (req.user.id != req.params.userId)
      // change this after creating get all and get one
      return res
        .status(401)
        .json({ error: "You cannot access an address you didn't create" });

    const userAddress = await fetchUserAddresses(req.params.userId);
    return res.status(200).json({
      message: `${userAddress.length} found`,
      userAddress,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'could not get addresses, please try again later',
    });
  }
};

export const getOneUserAddress = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;

  try {
    if (req.user.id != req.params.userId)
      return res
        .status(401)
        .json({ error: "You cannot access an address you didn't create" });

    const userAddress = await fetchOneUserAddress(
      req.params.userId,
      req.params.addressId,
    );

    return res.status(200).json({
      message: 'address fetched successfully',
      userAddress,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'could not get addresses, please try again later',
    });
  }
};

export const deleteUserAddress = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;

  try {
    if (req.user.id != req.params.userId)
      return res
        .status(401)
        .json({ error: "You cannot access an address you didn't create" });

    const userAddress = await deleteOneUserAddress(
      req.params.userId,
      req.params.addressId,
    );
    return res.status(200).json({
      message: 'address deleted successfully',
      userAddress,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'could not get addresses, please try again later',
    });
  }
};
