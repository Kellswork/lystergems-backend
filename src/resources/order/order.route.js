import { Router } from 'express';

import { verifyAuth } from '../../middlewares/validateUserAuth';
import addOrder from './orders.controller';

const router = Router();

router.post('/orders', verifyAuth, addOrder);

export default router;
