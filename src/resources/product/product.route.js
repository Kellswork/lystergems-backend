import { Router } from 'express';
import validateProduct from '../../middlewares/validateProduct';
import createProduct from './product.controllers';
import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';

const router = Router();

router.post(
  '/category/:categoryId/product',
  verifyAuth,
  validateAdmin,
  validateProduct,
  createProduct,
);

export default router;
