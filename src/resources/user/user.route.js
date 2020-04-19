import { Router } from 'express';
import { addUserInfo, login } from './auth.controller';
import validateUser, { validateLogin } from '../../middlewares/validateUser';
// import validateUserAddress from '../../middlewares/validateUserAddress';

const router = Router();
export default router;

router.post('/auth/register', validateUser, addUserInfo);
router.post('/auth/login', validateLogin, login);
// router.post('/users/:id/address', validateUserAddress, addUserAddressInfo);
