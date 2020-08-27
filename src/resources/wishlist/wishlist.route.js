import { Router } from 'express';
import { verifyAuth } from '../../middlewares/validateUserAuth';
import addProductToWishlist from './wishlist.controller';

const router = Router();

router.post('/users/:userId/wishlists', verifyAuth, addProductToWishlist);

export default router;
