import { Router } from 'express';
import {
  validateProduct,
  validateNameUniqueness,
  checkIfProductExists,
} from '../../middlewares/validateProduct';
import { createProduct, update, removeProduct } from './products.controller';
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
  checkIfProductExists,
  validateProduct,
  update,
);

router.delete(
  '/products/:id',
  verifyAuth,
  validateAdmin,
  checkIfProductExists,
  removeProduct,
);

export default router;
