import { formatResponse } from '../../helpers/baseHelper';
import {
  addToWishlist,
  fetchUserWishlist,
  deleteOneProductInWishlist,
} from './model/index.model';

export const addProductToWishlist = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const isProductInList = await fetchUserWishlist(id);
    if (isProductInList.length > 0)
      return formatResponse(
        res,
        { message: 'product has already been added to wishlist' },
        400,
      );

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
    console.log(error);
    return formatResponse(
      res,
      {
        error: 'could not save product to wishlist, please try again later',
      },
      500,
    );
  }
};

export const getUserWishlist = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const wishlist = await fetchUserWishlist(req.params.userId);
    const data = {
      wishlist,
    };
    return formatResponse(
      res,
      {
        message: `${wishlist.length} found`,
      },
      200,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      { error: 'could not get wishlist, please try again later' },
      500,
    );
  }
};

export const RemoveOneProductInWishlist = async (req, res) => {
  const { id } = req.user;
  req.body.user_id = id;
  try {
    const wishlistItem = await deleteOneProductInWishlist(
      req.params.userId,
      req.params.productId,
    );
    const data = {
      wishlistItem,
    };
    return formatResponse(
      res,
      { message: 'product has been removed from wishlist' },
      200,
      data,
    );
  } catch (error) {
    return formatResponse(
      res,
      {
        error:
          'could not get remove product from wishlist, please try again later',
      },
      500,
    );
  }
};
