import { Router } from 'express';

import validateCategory from '../../middlewares/validateCategory';
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
  validateCategory,
  editCategory,
);

router.delete('/categories/:id', verifyAuth, validateAdmin, deleteACategory);

export default router;
