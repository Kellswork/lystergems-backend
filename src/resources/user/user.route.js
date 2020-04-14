import { Router } from 'express';
import { addUserInfo, addUserAddressInfo } from './auth.controller';

const router = Router();
export default router;

router.post('/auth/register', addUserInfo);
router.post('/auth/register/address', addUserAddressInfo);
