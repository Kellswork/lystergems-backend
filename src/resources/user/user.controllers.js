import { createUserAddress } from './models/index.model';

export default addUserAddressInfo;

// will fix this in the future to use user_id from req.params
const addUserAddressInfo = async (req, res) => {
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
