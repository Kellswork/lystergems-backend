import createUserAddress from './model/index.model';

const addUserAddress = async (req, res) => {
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

export default addUserAddress;
