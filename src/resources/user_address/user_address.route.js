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
  validateUserAddress,
  updateUserAddress,
);

router.get('/users/:userId/address', verifyAuth, getUserAddresses);

router.get('/users/:userId/address/:addressId', verifyAuth, getOneUserAddress);
router.delete(
  '/users/:userId/address/:addressId',
  verifyAuth,
  deleteUserAddress,
);

export default router;
