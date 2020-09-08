import { Router } from 'express';
import { verifyAuth } from '../../middlewares/validateUserAuth';
import {
  addProductToWishlist,
  getUserWishlist,
  RemoveOneProductInWishlist,
} from './wishlist.controller';
import { checkUserId } from '../../middlewares/baseMiddleware';
import validateWishlist from '../../middlewares/validateWishlist';

const router = Router();

router.post(
  '/users/:userId/wishlists',
  verifyAuth,
  validateWishlist,
  addProductToWishlist,
);

router.get(
  '/users/:userId/wishlists',
  verifyAuth,
  checkUserId,
  getUserWishlist,
);

router.delete(
  '/users/:userId/wishlists/:productId',
  verifyAuth,
  checkUserId,
  RemoveOneProductInWishlist,
);

export default router;
