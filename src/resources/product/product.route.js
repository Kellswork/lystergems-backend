import { Router } from 'express';
import {
  validateProduct,
  validateNameUniqueness,
} from '../../middlewares/validateProduct';
import { createProduct, update } from './products.controller';
import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';

const router = Router();

router.post(
  '/categories/:categoryId/products',
  verifyAuth,
  validateAdmin,
  validateNameUniqueness,
  validateProduct,
  createProduct,
);

router.patch(
  '/products/:id',
  verifyAuth,
  validateAdmin,
  validateProduct,
  update,
);

export default router;
