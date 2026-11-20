
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { getDashboardStats ,getAllOrders,changeOrderStatus,getAdminOrderDetails} from '../controllers/adminController.js';
const router = express.Router();
// Test admin authorization
router.get('/test', verifyToken, adminMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ShopSmart Admin Panel!',
    admin: req.user
  });
});
// Admin dashboard statistics
router.get(
  '/dashboard',
  verifyToken,
  adminMiddleware,
  getDashboardStats,
  
);

router.get(
  '/orders',
  verifyToken,
  adminMiddleware,
  getAllOrders
);
router.patch(
  '/orders/:id/status',
  verifyToken,
  adminMiddleware,
  changeOrderStatus
);
router.get(
  '/orders/:id',
  verifyToken,
  adminMiddleware,
  getAdminOrderDetails
);
export default router;
