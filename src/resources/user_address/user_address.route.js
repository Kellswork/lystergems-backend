import { Router } from 'express';
import {
  addUserAddress,
  updateUserAddress,
  getUserAddresses,
  getOneUserAddress,
  deleteUserAddress,
} from './users_address.controller';
import { verifyAuth } from '../../middlewares/validateUserAuth';
import validateUserAddress from '../../middlewares/validateUserAddress';
import { checkUserId } from '../../middlewares/baseMiddleware';

const router = Router();

router.post(
  '/users/:id/address',
  verifyAuth,
  validateUserAddress,
  addUserAddress,
);

router.patch(
  '/users/:userId/address/:addressId',
  verifyAuth,
  checkUserId,
  validateUserAddress,
  updateUserAddress,
);

router.get('/users/:userId/address', verifyAuth, checkUserId, getUserAddresses);

router.get(
  '/users/:userId/address/:addressId',
  verifyAuth,
  checkUserId,
  getOneUserAddress,
);
router.delete(
  '/users/:userId/address/:addressId',
  verifyAuth,
  checkUserId,
  deleteUserAddress,
);

export default router;
