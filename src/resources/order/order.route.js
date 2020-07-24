import { Router } from 'express';

import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';
import { addOrder, updateOrder } from './orders.controller';
import {
  validateOrder,
  validateStatusUpdate,
  checkStatus,
} from '../../middlewares/validateOrder';

const router = Router();

router.post('/orders', verifyAuth, validateOrder, addOrder);
router.patch(
  '/orders/:id',
  verifyAuth,
  validateAdmin,
  checkStatus,
  validateStatusUpdate,
  updateOrder,
);

export default router;
