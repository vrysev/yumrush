import express from 'express';
import { 
  createOrder, 
  getOrderById, 
  getMyOrders, 
  getOrders,
  updateOrderStatus,
  updateOrderToDelivered
} from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
// None

// Protected routes
router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders); // Admin only, checked in controller

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, updateOrderStatus); // Admin only, checked in controller

router.route('/:id/deliver')
  .put(protect, updateOrderToDelivered); // Admin only, checked in controller

export default router;