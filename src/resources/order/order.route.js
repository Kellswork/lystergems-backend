import { Router } from 'express';

import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';
import {
  addOrder,
  updateOrder,
  cancelOrder,
  getAllOrders,
} from './orders.controller';
import {
  validateOrder,
  validateStatusUpdate,
  checkStatus,
  checkIfOrderExists,
  checkIfUserIsOwner,
  allowOnlyPendingOrder,
} from '../../middlewares/validateOrder';

const router = Router();

router.post('/orders', verifyAuth, validateOrder, addOrder);
router.patch(
  '/orders/:id',
  verifyAuth,
  validateAdmin,
  checkStatus,
  checkIfOrderExists,
  validateStatusUpdate,
  updateOrder,
);

router.get('/orders', verifyAuth, validateAdmin, getAllOrders);

router.patch(
  '/orders/:id/cancel',
  verifyAuth,
  checkIfOrderExists,
  checkIfUserIsOwner,
  allowOnlyPendingOrder,
  cancelOrder,
);

export default router;
