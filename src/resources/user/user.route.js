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
import { getUserProfile, updateUserProfile } from './user.controllers';
import { checkUserId } from '../../middlewares/baseMiddleware';

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
router.get('/users/:userId/profile', verifyAuth, checkUserId, getUserProfile);
router.patch(
  '/users/:userId/profile',
  verifyAuth,
  checkUserId,
  validateUser,
  updateUserProfile,
);

export default router;
