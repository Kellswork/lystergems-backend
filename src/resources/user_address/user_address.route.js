import { Router } from 'express';
import addUserAddress from './users_address.controller';
import { verifyAuth } from '../../middlewares/validateUserAuth';
import {
  validateUserAddress,
  checkIfUserAddressExists,
} from '../../middlewares/validateUserAddress';

const router = Router();

router.post(
  '/users/:id/address',
  verifyAuth,
  validateUserAddress,
  checkIfUserAddressExists,
  addUserAddress,
);

export default router;
