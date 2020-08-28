import { Router } from 'express';
import {
  addUserInfo,
  login,
  verifyEmail,
  resetPasswordLink,
  newPassword,
} from './auth.controller';
import { validateUser, validateLogin } from '../../middlewares/validateUser';
import { verifyAuth } from '../../middlewares/validateUserAuth';
import {
  restrictAccessToOwnerAndAdmin,
  checkIfOrderExists,
} from '../../middlewares/validateOrder';
import { getOrderById } from '../order/orders.controller';

const router = Router();

router.post('/auth/register', validateUser, addUserInfo);
router.post('/auth/login', validateLogin, login);
router.post('/auth/resetPassword', resetPasswordLink);
router.patch('/auth/verifyEmail', verifyEmail);
router.patch('/auth/newPassword', newPassword);
router.get(
  '/orders/:id',
  verifyAuth,
  checkIfOrderExists,
  restrictAccessToOwnerAndAdmin,
  getOrderById,
);

export default router;
