import { Router } from 'express';

import validateCategory from '../../middlewares/validateCategory';
import createCategory from './category.controller';
import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';

const router = Router();

router.post(
  '/categories',
  validateCategory,
  verifyAuth,
  validateAdmin,
  createCategory,
);

export default router;
