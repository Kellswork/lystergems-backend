import { Router } from 'express';
import { addUserInfo, login, verifyEmail } from './auth.controller';
import { validateUser, validateLogin } from '../../middlewares/validateUser';
// import validateUserAddress from '../../middlewares/validateUserAddress';

const router = Router();
export default router;

router.post('/auth/register', validateUser, addUserInfo);
router.post('/auth/login', validateLogin, login);
router.get('/auth/email_verification', verifyEmail);
// router.post('/users/:id/address', validateUserAddress, addUserAddressInfo);
