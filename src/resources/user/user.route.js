import { Router } from 'express';
import { addUserInfo, addUserAddressInfo } from './auth.controller';
import validateUser from '../../middlewares/validateUser';

const router = Router();
export default router;

router.post('/auth/register', validateUser, addUserInfo);
router.post('/auth/register/address', addUserAddressInfo);
