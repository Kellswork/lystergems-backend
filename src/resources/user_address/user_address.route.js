import { Router } from 'express';
import { addUserAddress, updateUserAddress } from './users_address.controller';
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

export default router;
