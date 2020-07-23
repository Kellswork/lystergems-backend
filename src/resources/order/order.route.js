import { Router } from 'express';

import { verifyAuth } from '../../middlewares/validateUserAuth';
import addOrder from './orders.controller';
import validateOrder from '../../middlewares/validateOrder';

const router = Router();

router.post('/orders', verifyAuth, validateOrder, addOrder);

export default router;
