import { Router } from 'express';

import {
  validateCategory,
  checkIfCategoryExists,
} from '../../middlewares/validateCategory';
import {
  addCategory,
  fetchAllCategories,
  editCategory,
  deleteACategory,
} from './category.controller';
import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';

const router = Router();

router.post(
  '/categories',
  verifyAuth,
  validateAdmin,
  validateCategory,
  addCategory,
);
router.get('/categories', verifyAuth, fetchAllCategories);
router.patch(
  '/categories/:id',
  verifyAuth,
  validateAdmin,
  checkIfCategoryExists,
  validateCategory,
  editCategory,
);

router.delete(
  '/categories/:id',
  verifyAuth,
  validateAdmin,
  checkIfCategoryExists,
  deleteACategory,
);

export default router;
