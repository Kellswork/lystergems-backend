import { Router } from 'express';

import { verifyAuth } from '../../middlewares/validateUserAuth';
import create from './orders.controller';
import validateOrder from '../../middlewares/validateOrder';

const router = Router();

router.post('/orders', verifyAuth, validateOrder, create);

export default router;
