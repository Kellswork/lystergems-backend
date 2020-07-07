import { Router } from 'express';
import validateProduct from '../../middlewares/validateProduct';
import { createProduct, fetchProductsInaCategory } from './product.controllers';
import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';

const router = Router();

router.post(
  '/categories/:categoryId/products',
  verifyAuth,
  validateAdmin,
  validateProduct,
  createProduct,
);

router.get('/categories/:categoryId/products', fetchProductsInaCategory);

export default router;
