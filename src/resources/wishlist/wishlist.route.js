import { Router } from 'express';
import { verifyAuth } from '../../middlewares/validateUserAuth';
import { addProductToWishlist, getUserWishlist } from './wishlist.controller';
import { checkUserId } from '../../middlewares/baseMiddleware';

const router = Router();

router.post('/users/:userId/wishlists', verifyAuth, addProductToWishlist);

router.get(
  '/users/:userId/wishlists',
  verifyAuth,
  checkUserId,
  getUserWishlist,
);

export default router;
