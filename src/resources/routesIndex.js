import { Router } from 'express';

import registerRoute from './user/user.route';
import categoryRoute from './category/category.route';
import productRoute from './product/product.route';

const router = Router();

router.use('/', registerRoute);
router.use('/', categoryRoute);
router.use('/', productRoute);

export default router;
