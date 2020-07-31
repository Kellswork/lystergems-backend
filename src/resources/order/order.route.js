import { Router } from 'express';

import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';
import {
  addOrder,
  updateOrder,
  getOrderById,
  cancelOrder,
} from './orders.controller';
import {
  validateOrder,
  validateStatusUpdate,
  checkStatus,
  checkIfOrderExists,
  restrictAccessToOwnerAndAdmin,
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

// I will move this to users route when we start working on the users functionalities
router.get(
  '/orders/:id',
  verifyAuth,
  checkIfOrderExists,
  restrictAccessToOwnerAndAdmin,
  getOrderById,
);

router.patch(
  '/orders/:id/cancel',
  verifyAuth,
  checkIfOrderExists,
  checkIfUserIsOwner,
  allowOnlyPendingOrder,
  cancelOrder,
);

export default router;
