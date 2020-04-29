import { Router } from 'express';

import registerRoute from './user/user.route';
import categoryRoute from './category/category.route';

const router = Router();

router.use('/', registerRoute);
router.use('/', categoryRoute);

export default router;
