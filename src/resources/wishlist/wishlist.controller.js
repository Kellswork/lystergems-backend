import { formatResponse } from '../../helpers/baseHelper';

const addProductToWishlist = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const wishlist = await addToWishlist(req.body);
    const data = {
      wishlist,
    };
    return formatResponse(
      res,
      {
        message: 'Product has been saved to wishlist',
      },
      201,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      {
        error: 'could not add product to wishlist, please try again later',
      },
      500,
    );
  }
};

export default addProductToWishlist;
