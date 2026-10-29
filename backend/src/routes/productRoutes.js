import { Router } from 'express';
import { listProducts, searchProducts, getProduct, createProduct } from '../controllers/productController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const router=Router(); router.get('/',listProducts); router.get('/search',searchProducts); router.get('/:slug',getProduct); router.post('/',requireAuth,requireAdmin,createProduct); export default router;
