import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  getUsers,
  createAdminUser,
  getUserById,
  updateUserById,
  updateUserAdminStatus
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/create-admin', createAdminUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin routes (protection is checked in the controllers)
router.route('/')
  .get(protect, getUsers);

// User management routes (admin only)
router.route('/:id')
  .get(protect, getUserById)
  .put(protect, updateUserById)
  .patch(protect, updateUserAdminStatus);

export default router;
