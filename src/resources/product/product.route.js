import { Router } from 'express';
import validateProduct from '../../middlewares/validateProduct';
import {
  createProduct,
  fetchProductsInaCategory,
  fetchOneProduct,
} from './product.controllers';
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
router.get('/categories/:categoryId/products/:id', fetchOneProduct);

export default router;
