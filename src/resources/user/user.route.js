import { Router } from 'express';
import {
  addUserInfo,
  login,
  verifyEmail,
  resetPasswordLink,
  newPassword,
} from './auth.controller';
import { validateUser, validateLogin } from '../../middlewares/validateUser';

const router = Router();

router.post('/auth/register', validateUser, addUserInfo);
router.post('/auth/login', validateLogin, login);
router.post('/auth/resetPassword', resetPasswordLink);
router.patch('/auth/verifyEmail', verifyEmail);
router.patch('/auth/newPassword', newPassword);

export default router;
