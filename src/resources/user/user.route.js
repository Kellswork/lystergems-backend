import { Router } from 'express';
import {
  addUserInfo,
  login,
  verifyEmail,
  resetPassword,
} from './auth.controller';
import { validateUser, validateLogin } from '../../middlewares/validateUser';

const router = Router();
export default router;

router.post('/auth/register', validateUser, addUserInfo);
router.post('/auth/login', validateLogin, login);
router.post('/auth/resetPassword', resetPassword);
router.patch('/auth/verifyEmail', verifyEmail);
