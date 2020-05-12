import { Router } from 'express';

import validateCategory from '../../middlewares/validateCategory';
import { addCategory, fetchAllCategories } from './category.controller';
import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';

const router = Router();

router.post(
  '/categories',
  validateCategory,
  verifyAuth,
  validateAdmin,
  addCategory,
);
router.get('/categories', verifyAuth, validateAdmin, fetchAllCategories);

export default router;
