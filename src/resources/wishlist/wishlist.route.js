import { Router } from 'express';
import { verifyAuth } from '../../middlewares/validateUserAuth';
import {
  addProductToWishlist,
  getUserWishlist,
  RemoveOneProductInWishlist,
} from './wishlist.controller';
import { checkUserId } from '../../middlewares/baseMiddleware';

const router = Router();

router.post('/users/:userId/wishlists', verifyAuth, addProductToWishlist);

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
