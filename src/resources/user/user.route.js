import { Router } from 'express';
import { addUserInfo, addUserAddressInfo } from './auth.controller';
import validateUser from '../../middlewares/validateUser';
import validateUserAddress from '../../middlewares/validateUserAddress';

const router = Router();
export default router;

router.post('/auth/register', validateUser, addUserInfo);
router.post('/users/:id/address', validateUserAddress, addUserAddressInfo);
