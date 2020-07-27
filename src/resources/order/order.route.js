import { Router } from 'express';

import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';
import { addOrder, updateOrder, getOrderById } from './orders.controller';
import {
  validateOrder,
  validateStatusUpdate,
  checkStatus,
  checkIfOrderExists,
  restrictAccessToOwnerAndAdmin,
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

export default router;
