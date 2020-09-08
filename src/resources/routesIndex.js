import { Router } from 'express';

import authRoute from './user/user.route';
import categoryRoute from './category/category.route';
import productRoute from './product/product.route';
import orderRoute from './order/order.route';
import userAddressRoute from './user_address/user_address.route';
import userWishlist from './wishlist/wishlist.route';

const router = Router();

router.use('/', authRoute);
router.use('/', categoryRoute);
router.use('/', productRoute);
router.use('/', orderRoute);
router.use('/', userAddressRoute);
router.use('/', userWishlist);

export default router;
