import { Router } from 'express';

import { verifyAuth } from '../../middlewares/validateUserAuth';
import create from './orders.controller';

const router = Router();

router.post('/orders', verifyAuth, create);

export default router;
