
import express from 'express';
import {
  placeOrder,
  fetchMyOrders,
  fetchOrderDetails
} from '../controllers/orderController.js';

import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();
// Place a new order
router.post('/', verifyToken, placeOrder);
// Get logged-in user's orders
router.get('/my-orders', verifyToken, fetchMyOrders);
// Get details of a specific order
router.get('/:id', verifyToken, fetchOrderDetails);
export default router;


