
import express from 'express';
import { placeOrder } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected order creation API
router.post('/', verifyToken, placeOrder);
export default router;
