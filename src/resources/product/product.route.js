import { Router } from 'express';
import validateProduct from '../../middlewares/validateProduct';
import createProduct from './product.controllers';
import { verifyAuth, validateAdmin } from '../../middlewares/validateUserAuth';

const router = Router();

router.post(
  '/product',
  validateProduct,
  verifyAuth,
  validateAdmin,
  createProduct,
);

export default router;
